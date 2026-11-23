import axios from 'axios'
import https from 'https'
import { Browser, BrowserContext, chromium } from 'playwright'
import { LoggerInterface, LogLevel } from '../logger/types'
import { MarkedUrl } from '../tool/markedUrl'
import { LinkStatus } from './linkStatus'
import { LinkValidatorCache } from './linkValidatorCache'

// Valid     : 2xx/3xx confirmed, link is reachable
// Invalid   : 404/410, link is definitively broken
// Protected : Cloudflare challenge, a bot cannot tell whether the link works
// Uncertain : anything else (403, 429, 5xx, timeout, network error), escalate to next validation method
enum ValidationResult {
  Valid = 'valid',
  Invalid = 'invalid',
  Protected = 'protected',
  Uncertain = 'uncertain'
}

interface ValidationOutcome {
  result: ValidationResult
  status?: number
}

export interface LinkCheck {
  link: string
  status: LinkStatus
}

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
   */
  public static logLinkStatus(check: LinkCheck, context: LinkLogContext): void {
    if (check.status === LinkStatus.Valid) {
      return
    }
    const { logger, brokenLevel, field, id, rowId } = context
    logger.logLink(this._logLevel(check.status, brokenLevel), { url: check.link, status: check.status, field }, id, rowId)
  }

  public static async findInvalidLinks(inputText: string): Promise<LinkCheck[]> {
    const foundLinks = this.foundLinks(inputText)
    const invalidLinks: LinkCheck[] = []
    for (const rawLink of foundLinks) {
      const link = this.forceHttps(rawLink)
      const status = await LinkValidator.checkLink(link)
      if (status !== LinkStatus.Valid) {
        invalidLinks.push({ link, status })
      }
    }

    return invalidLinks
  }

  public static foundLinks(inputText: string) {
    return new MarkedUrl(inputText).getExternal()
  }

  public static async checkLink(rawLink: string): Promise<LinkStatus> {
    const link = this.forceHttps(rawLink)

    const cached = this._cache.get(link)
    if (cached !== undefined) {
      return cached
    }

    const status = await this._checkLink(link)
    this._cache.set(link, status)
    return status
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
    if (status === LinkStatus.Unverifiable) {
      return LogLevel.Info
    }
    return brokenLevel
  }

  private static async _checkLink(link: string): Promise<LinkStatus> {
    if (this.isMalformed(link)) {
      return LinkStatus.Malformed
    }

    const host = new URL(link).hostname
    if (this._protectedHosts.has(host)) {
      return LinkStatus.Unverifiable
    }

    const validations = [() => this._headValidation(link), () => this._fetchValidation(link), () => this._axiosValidation(link)]

    let isBotBlocked = false
    for (const validation of validations) {
      const outcome = await validation()
      await new Promise((resolve) => setTimeout(resolve, 50))

      switch (outcome.result) {
        case ValidationResult.Valid:
          return LinkStatus.Valid
        case ValidationResult.Invalid:
          return LinkStatus.Broken
        case ValidationResult.Protected:
          this._protectedHosts.add(host)
          return LinkStatus.Unverifiable
      }
      if (this._isBotBlockingStatus(outcome.status)) {
        isBotBlocked = true
      }
    }

    // 5xx, timeouts and network/TLS errors on every method: a visitor would most likely fail too.
    if (!isBotBlocked) {
      return LinkStatus.Broken
    }

    // 403/429: likely bot-blocking, since all pages are expected to be public use playwright to confirm.
    if (this._isEnablePlaywright()) {
      const outcome = await this._playwrightValidation(link)
      if (outcome.result === ValidationResult.Valid) {
        return LinkStatus.Valid
      }
      if (outcome.result === ValidationResult.Invalid) {
        return LinkStatus.Broken
      }
      if (outcome.result === ValidationResult.Protected) {
        this._protectedHosts.add(host)
      }
    }

    return LinkStatus.Unverifiable
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
    } catch {
      return { result: ValidationResult.Uncertain }
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
    } catch {
      return { result: ValidationResult.Uncertain }
    }
  }

  private static async _playwrightValidation(link: string): Promise<ValidationOutcome> {
    this._activePlaywrightChecks++
    let context: BrowserContext | undefined
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
      const page = await context.newPage()
      const response = await page.goto(link, { timeout: 20000 })
      if (!response) {
        return { result: ValidationResult.Uncertain }
      }
      return this._classifyResponse(response.status(), response.headers()['cf-mitigated'])
    } catch {
      return { result: ValidationResult.Uncertain }
    } finally {
      await context?.close().catch(() => undefined)
      this._activePlaywrightChecks--
      this._scheduleBrowserClose()
    }
  }

  private static _getBrowser(): Promise<Browser> {
    this._clearBrowserIdleTimer()
    if (!this._browser) {
      this._browser = chromium.launch().catch((error: unknown) => {
        // Do not keep a failed launch: the next check will retry
        this._browser = undefined
        throw error
      })
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
