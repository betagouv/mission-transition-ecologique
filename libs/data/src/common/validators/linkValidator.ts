import axios from 'axios'
import https from 'https'
import { Browser, BrowserContext, chromium } from 'playwright'
import { LoggerInterface, LogLevel } from '../logger/types'
import { MarkedUrl } from '../tool/markedUrl'
import { LinkStatus } from './linkStatus'
import { LinkValidatorCache } from './linkValidatorCache'
import { NetworkError, networkErrorLabel, toNetworkError } from './networkError'

// Valid     : 2xx/3xx confirmed, link is reachable
// Invalid   : 404/410, link is definitively broken
// Protected : Cloudflare challenge, a bot cannot tell whether the link works
// Uncertain : anything else (403, 429, 5xx, timeout, network error), escalate to next validation method
// BrowserUnavailable : playwright could not be launched, says nothing about the link
enum ValidationResult {
  Valid = 'valid',
  Invalid = 'invalid',
  Protected = 'protected',
  Uncertain = 'uncertain',
  BrowserUnavailable = 'browserUnavailable'
}

interface ValidationOutcome {
  result: ValidationResult
  status?: number
  // set when the request failed without any HTTP response
  error?: NetworkError
}

export interface LinkCheck {
  link: string
  status: LinkStatus
  // why the link is not valid, shown in the report (e.g. "HTTP 500", "délai dépassé")
  reason?: string
}

type LinkResult = Omit<LinkCheck, 'link'>

export interface LinkLogContext {
  logger: LoggerInterface
  brokenLevel: LogLevel
  // Baserow field where the link was found (e.g. "étape 1", "Contact Question")
  field: string
  id: string
  rowId: number
}

export class LinkValidator {
  private static _cache = LinkValidatorCache.fromEnv()
  private static _protectedHosts = new Set<string>()
  // Reasons of the non valid links checked during this run, the cache only keeps the status
  private static _reasons = new Map<string, string>()

  // Shared playwright browser, launched on first use and closed after a short idle delay
  private static _browser: Promise<Browser> | undefined
  private static _browserIdleTimer: ReturnType<typeof setTimeout> | undefined
  private static _activePlaywrightChecks = 0
  private static readonly _browserIdleDelay = 5000

  public static forceHttps(link: string) {
    return link.replace(/^http:\/\//i, 'https://')
  }

  public static async logInvalidLinks(
    inputText: string,
    logger: LoggerInterface,
    logLevel: LogLevel,
    fieldName: string,
    id: string,
    rowId: number
  ): Promise<void> {
    const checks = await LinkValidator.findInvalidLinks(inputText)
    for (const check of checks) {
      LinkValidator.logLinkStatus(check, { logger, brokenLevel: logLevel, field: fieldName, id, rowId })
    }
  }

  /**
   * Logs a non valid link with a level depending on its status:
   * - Broken       → the caller's level
   * - Malformed    → critical, the link can never work
   * - Unverifiable → info, to be checked manually
   * - Forbidden    → info, to be checked manually
   * - Unreachable  → info, to be checked manually
   */
  public static logLinkStatus(check: LinkCheck, context: LinkLogContext): void {
    if (check.status === LinkStatus.Valid) {
      return
    }
    const { logger, brokenLevel, field, id, rowId } = context
    const link = { url: check.link, status: check.status, field, ...(check.reason ? { reason: check.reason } : {}) }
    logger.logLink(this._logLevel(check.status, brokenLevel), link, id, rowId)
  }

  public static async findInvalidLinks(inputText: string): Promise<LinkCheck[]> {
    const foundLinks = this.foundLinks(inputText)
    const invalidLinks: LinkCheck[] = []
    for (const rawLink of foundLinks) {
      const check = await LinkValidator.check(rawLink)
      if (check.status !== LinkStatus.Valid) {
        invalidLinks.push(check)
      }
    }

    return invalidLinks
  }

  public static foundLinks(inputText: string) {
    return new MarkedUrl(inputText).getExternal()
  }

  public static async checkLink(rawLink: string): Promise<LinkStatus> {
    return (await this.check(rawLink)).status
  }

  public static async check(rawLink: string): Promise<LinkCheck> {
    const link = this.forceHttps(rawLink)

    const cached = this._cache.get(link)
    if (cached !== undefined) {
      return this._withReason({ link, status: cached }, this._reasons.get(link))
    }

    const { status, reason } = await this._checkLink(link)
    this._cache.set(link, status)
    if (reason) {
      this._reasons.set(link, reason)
    }
    return this._withReason({ link, status }, reason)
  }

  /**
   * A link is malformed when it cannot be a public web page:
   * unparsable, non http(s) protocol, or host without a domain (e.g. `https://file:///Users/...`, `localhost`).
   */
  public static isMalformed(link: string): boolean {
    let url: URL
    try {
      url = new URL(link)
    } catch {
      return true
    }
    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      return true
    }
    return !url.hostname.includes('.')
  }

  private static _logLevel(status: LinkStatus, brokenLevel: LogLevel): LogLevel {
    if (status === LinkStatus.Malformed) {
      return LogLevel.Critic
    }
    if (status === LinkStatus.Unverifiable || status === LinkStatus.Forbidden || status === LinkStatus.Unreachable) {
      return LogLevel.Info
    }
    return brokenLevel
  }

  private static _withReason(check: LinkCheck, reason: string | undefined): LinkCheck {
    return reason ? { ...check, reason } : check
  }

  /**
   * Checks a link with HEAD, GET (fetch) then GET (axios), and with a real browser when the GET requests are not conclusive:
   * - 403/429 on a GET request: likely bot-blocking, since all pages are expected to be public
   * - network error or timeout on every GET request: some firewalls drop bot connections instead of answering 403
   * Any other HTTP error on the GET requests (5xx, 401, other 4xx), or an unknown domain, means a visitor would most likely fail too.
   * HEAD is only trusted for a success or a challenge: some servers answer it badly (403, 405, 5xx) while GET works.
   */
  private static async _checkLink(link: string): Promise<LinkResult> {
    if (this.isMalformed(link)) {
      return { status: LinkStatus.Malformed }
    }

    // A Cloudflare challenge usually covers the whole domain: the other links of the host are not requested again during the run
    const host = new URL(link).hostname
    if (this._protectedHosts.has(host)) {
      return { status: LinkStatus.Unverifiable }
    }

    const headOutcome = await this._headValidation(link)
    if (headOutcome.result === ValidationResult.Valid) {
      return { status: LinkStatus.Valid }
    }
    if (headOutcome.result === ValidationResult.Protected) {
      return { status: LinkStatus.Unverifiable }
    }

    const getOutcomes: ValidationOutcome[] = []
    for (const validation of [() => this._fetchValidation(link), () => this._axiosValidation(link)]) {
      await this._pause()
      const outcome = await validation()
      switch (outcome.result) {
        case ValidationResult.Valid:
          return { status: LinkStatus.Valid }
        case ValidationResult.Invalid:
          return { status: LinkStatus.Broken, reason: `HTTP ${outcome.status}` }
        case ValidationResult.Protected:
          this._protectedHosts.add(host)
          return { status: LinkStatus.Unverifiable }
      }
      getOutcomes.push(outcome)
    }

    const isBotBlocked = getOutcomes.some((outcome) => this._isBotBlockingStatus(outcome.status))
    const isNetworkFailure = getOutcomes.every((outcome) => outcome.status === undefined)
    if (!isBotBlocked && !isNetworkFailure) {
      return { status: LinkStatus.Broken, reason: this._httpReason(getOutcomes) }
    }
    if (isNetworkFailure && getOutcomes.some((outcome) => outcome.error === NetworkError.DomainNotFound)) {
      return { status: LinkStatus.Broken, reason: networkErrorLabel(NetworkError.DomainNotFound) }
    }

    return this._browserCheck(link, host, isBotBlocked, this._networkReason(getOutcomes))
  }

  /**
   * Last resort with a real browser:
   * - success → Valid
   * - challenge → Unverifiable, for every link of the host
   * - 429 → Unverifiable (rate limited)
   * - 403 without challenge → Forbidden: either a really deleted file, or a firewall that also blocks headless browsers
   *   or datacenter IPs (frequent from the CI), a bot cannot tell
   * - any other HTTP error (401, 5xx…) → Broken
   * - unknown domain → Broken
   * - other navigation error → Unverifiable after a 403/429, Unreachable after network errors only
   * - browser disabled or unavailable → same as a navigation error
   * Without a browser, a persistent 403 therefore stays Unverifiable (collapsed section) instead of Forbidden:
   * only a browser can tell that a real visitor gets the 403 too.
   */
  private static async _browserCheck(link: string, host: string, isBotBlocked: boolean, networkReason: string): Promise<LinkResult> {
    const fallback = (browserReason?: string): LinkResult =>
      isBotBlocked
        ? { status: LinkStatus.Unverifiable }
        : { status: LinkStatus.Unreachable, reason: browserReason ? `${networkReason} ; navigateur : ${browserReason}` : networkReason }
    if (!this._isEnablePlaywright()) {
      return fallback()
    }

    const outcome = await this._playwrightValidation(link)
    switch (outcome.result) {
      case ValidationResult.Valid:
        return { status: LinkStatus.Valid }
      case ValidationResult.Invalid:
        return { status: LinkStatus.Broken, reason: `HTTP ${outcome.status} dans le navigateur` }
      case ValidationResult.Protected:
        this._protectedHosts.add(host)
        return { status: LinkStatus.Unverifiable }
      case ValidationResult.BrowserUnavailable:
        return fallback()
    }
    if (outcome.error === NetworkError.DomainNotFound) {
      return { status: LinkStatus.Broken, reason: networkErrorLabel(NetworkError.DomainNotFound) }
    }
    if (outcome.status === undefined) {
      return fallback(networkErrorLabel(outcome.error ?? NetworkError.Other))
    }
    if (outcome.status === 429) {
      return { status: LinkStatus.Unverifiable }
    }
    const reason = `HTTP ${outcome.status} dans le navigateur`
    return { status: outcome.status === 403 ? LinkStatus.Forbidden : LinkStatus.Broken, reason }
  }

  // "HTTP 500", or "HTTP 500 / 502" when the GET requests disagree
  private static _httpReason(outcomes: ValidationOutcome[]): string {
    const statuses = [...new Set(outcomes.map((outcome) => outcome.status).filter((status) => status !== undefined))]
    return `HTTP ${statuses.join(' / ')}`
  }

  // "délai dépassé", or "délai dépassé / connexion coupée" when the GET requests disagree
  private static _networkReason(outcomes: ValidationOutcome[]): string {
    const errors = [...new Set(outcomes.map((outcome) => outcome.error ?? NetworkError.Other))]
    return errors.map((error) => networkErrorLabel(error)).join(' / ')
  }

  private static _pause(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 50))
  }

  private static _isBotBlockingStatus(status: number | undefined): boolean {
    return status === 403 || status === 429
  }

  /**
   * Classifies an HTTP response:
   * - Cloudflare challenge → ValidationResult.Protected
   * - 2xx/3xx              → ValidationResult.Valid
   * - 404/410              → ValidationResult.Invalid
   * - other                → ValidationResult.Uncertain
   */
  private static _classifyResponse(status: number, cfMitigated: string | null | undefined): ValidationOutcome {
    if (cfMitigated === 'challenge') {
      return { result: ValidationResult.Protected, status }
    }
    if (status < 400) {
      return { result: ValidationResult.Valid, status }
    }
    if (status === 404 || status === 410) {
      return { result: ValidationResult.Invalid, status }
    }
    return { result: ValidationResult.Uncertain, status }
  }

  // Shared browser-like headers to reduce bot detection
  private static _browserLikeHeaders(): Record<string, string> {
    return {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
      Connection: 'keep-alive'
    }
  }

  private static async _headValidation(link: string): Promise<ValidationOutcome> {
    try {
      const response = await fetch(new URL(link), {
        method: 'HEAD',
        redirect: 'follow',
        signal: AbortSignal.timeout(5000),
        headers: this._browserLikeHeaders()
      })
      const outcome = this._classifyResponse(response.status, response.headers.get('cf-mitigated'))
      // Some servers answer HEAD badly (405, 404, 5xx) while GET works: only trust a success or a challenge
      if (outcome.result === ValidationResult.Invalid) {
        return { result: ValidationResult.Uncertain, status: outcome.status }
      }
      return outcome
    } catch {
      return { result: ValidationResult.Uncertain }
    }
  }

  private static async _fetchValidation(link: string): Promise<ValidationOutcome> {
    try {
      const response = await fetch(new URL(link), {
        method: 'GET',
        redirect: 'follow',
        signal: AbortSignal.timeout(10000),
        headers: this._browserLikeHeaders()
      })
      return this._classifyResponse(response.status, response.headers.get('cf-mitigated'))
    } catch (error) {
      return { result: ValidationResult.Uncertain, error: toNetworkError(error) }
    }
  }

  private static async _axiosValidation(link: string): Promise<ValidationOutcome> {
    try {
      const agent = new https.Agent({
        // to accept poorly configured partner websites and disable the codeQL CD Warning
        // codeql[js/disabled-certificate-validation]: disable
        rejectUnauthorized: false
      })

      const response = await axios.get(link, {
        timeout: 10000,
        httpsAgent: agent,
        headers: this._browserLikeHeaders(),
        // Axios throws by default on 4xx/5xx, handle status codes ourselves
        validateStatus: () => true
      })
      return this._classifyResponse(response.status, response.headers['cf-mitigated'] as string | undefined)
    } catch (error) {
      return { result: ValidationResult.Uncertain, error: toNetworkError(error) }
    }
  }

  private static async _playwrightValidation(link: string): Promise<ValidationOutcome> {
    this._activePlaywrightChecks++
    let context: BrowserContext | undefined
    try {
      try {
        const browser = await this._getBrowser()
        // A fresh context per link isolates cookies while reusing the same browser process
        context = await browser.newContext({
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          extraHTTPHeaders: {
            Referer: 'https://mission-transition-ecologique.beta.gouv.fr/',
            'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7'
          }
        })
      } catch {
        return { result: ValidationResult.BrowserUnavailable }
      }
      const page = await context.newPage()
      const response = await page.goto(link, { timeout: 20000 })
      if (!response) {
        return { result: ValidationResult.Uncertain }
      }
      return this._classifyResponse(response.status(), response.headers()['cf-mitigated'])
    } catch (error) {
      // A file served as an attachment (e.g. a PDF) makes goto fail once the download starts: the link works
      if (error instanceof Error && error.message.includes('Download is starting')) {
        return { result: ValidationResult.Valid }
      }
      return { result: ValidationResult.Uncertain, error: toNetworkError(error) }
    } finally {
      await context?.close().catch(() => undefined)
      this._activePlaywrightChecks--
      this._scheduleBrowserClose()
    }
  }

  private static _getBrowser(): Promise<Browser> {
    this._clearBrowserIdleTimer()
    if (!this._browser) {
      const launch: Promise<Browser> = chromium.launch().then(
        (browser) => {
          // A crashed browser is replaced on the next check
          browser.on('disconnected', () => {
            if (this._browser === launch) {
              this._browser = undefined
            }
          })
          return browser
        },
        (error: unknown) => {
          // Do not keep a failed launch: the next check will retry
          if (this._browser === launch) {
            this._browser = undefined
          }
          throw error
        }
      )
      this._browser = launch
    }
    return this._browser
  }

  // Closing after an idle delay lets the generation scripts exit without an explicit cleanup call
  private static _scheduleBrowserClose(): void {
    this._clearBrowserIdleTimer()
    if (this._activePlaywrightChecks > 0 || !this._browser) {
      return
    }
    this._browserIdleTimer = setTimeout(() => {
      const browser = this._browser
      this._browser = undefined
      this._browserIdleTimer = undefined
      void browser?.then((instance) => instance.close()).catch(() => undefined)
    }, this._browserIdleDelay)
  }

  private static _clearBrowserIdleTimer(): void {
    if (this._browserIdleTimer) {
      clearTimeout(this._browserIdleTimer)
      this._browserIdleTimer = undefined
    }
  }

  private static _isEnablePlaywright(): boolean {
    if (process.env['LINK_VALIDATOR_PLAYWRIGHT_ENABLE']) {
      return process.env['LINK_VALIDATOR_PLAYWRIGHT_ENABLE'] != 'false'
    }
    return true
  }
}
