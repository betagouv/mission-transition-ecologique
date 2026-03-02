import axios from 'axios'
import https from 'https'
import { chromium } from 'playwright'
import { LoggerInterface, LogLevel } from '../logger/types'
import { MarkedUrl } from '../tool/markedUrl'
import { LinkValidatorCache } from './linkValidatorCache'

// Valid     : 2xx confirmed — link is reachable
// Invalid   : 404/410/network error — link is definitively broken
// Uncertain : 403/429 — likely bot-blocking, escalate to next validation method
enum ValidationResult {
  Valid = 'valid',
  Invalid = 'invalid',
  Uncertain = 'uncertain'
}

export class LinkValidator {
  private static _cache = new LinkValidatorCache()

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
    const invalidLinks = await LinkValidator.findInvalidLinks(inputText)
    for (const link of invalidLinks) {
      logger.log(logLevel, 'Lien invalide détecté dans le champ ' + fieldName, id, rowId, `[Lien cassé](${link})`)
    }
  }

  public static async findInvalidLinks(inputText: string): Promise<string[]> {
    const foundLinks = this.foundLinks(inputText)
    const invalidLinks = []
    for (const rawLink of foundLinks) {
      const link = this.forceHttps(rawLink)
      const isValid = await LinkValidator.isValidLink(link)
      if (!isValid) {
        invalidLinks.push(link)
      }
    }

    return invalidLinks
  }

  public static foundLinks(inputText: string) {
    return new MarkedUrl(inputText).getExternal()
  }

  public static async isValidLink(rawLink: string): Promise<boolean> {
    const link = this.forceHttps(rawLink)

    const cached = this._cache.get(link)
    if (cached !== undefined) {
      return cached
    }

    const isValid = await this._checkLink(link)
    this._cache.set(link, isValid)
    return isValid
  }

  private static async _checkLink(link: string): Promise<boolean> {
    const validations = [() => this._headValidation(link), () => this._fetchValidation(link), () => this._axiosValidation(link)]

    for (const validation of validations) {
      const result = await validation()
      await new Promise((resolve) => setTimeout(resolve, 50))

      if (result === ValidationResult.Invalid) {
        return false
      }
      if (result === ValidationResult.Valid) {
        return true
      }
    }

    // ValidationResult.Uncertain (403/429): since all pages are expected to be public,
    // use playwright to confirm a real 2xx response.
    // If playwright cannot confirm either, the link is reported as broken.
    if (this._isEnablePlaywright()) {
      const result = await this._playwrightValidation(link)
      return result === ValidationResult.Valid
    }

    return false
  }

  /**
   * Classifies an HTTP status code:
   * - 2xx/3xx → ValidationResult.Valid
   * - 403/429 → ValidationResult.Uncertain (likely bot-blocking, pages are expected to be public)
   * - other   → ValidationResult.Invalid
   */
  private static _classifyStatus(status: number): ValidationResult {
    if (status < 400) {
      return ValidationResult.Valid
    }
    if (status === 403 || status === 429) {
      return ValidationResult.Uncertain
    }
    return ValidationResult.Invalid
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

  private static async _headValidation(link: string): Promise<ValidationResult> {
    try {
      const response = await fetch(new URL(link), {
        method: 'HEAD',
        redirect: 'follow',
        signal: AbortSignal.timeout(3000),
        headers: this._browserLikeHeaders()
      })
      // 405 = HEAD not supported, fall through to GET
      if (response.status === 405) {
        return ValidationResult.Uncertain
      }
      return this._classifyStatus(response.status)
    } catch {
      return ValidationResult.Uncertain
    }
  }

  private static async _fetchValidation(link: string): Promise<ValidationResult> {
    try {
      const response = await fetch(new URL(link), {
        method: 'GET',
        redirect: 'follow',
        signal: AbortSignal.timeout(5000),
        headers: this._browserLikeHeaders()
      })
      return this._classifyStatus(response.status)
    } catch {
      return ValidationResult.Uncertain
    }
  }

  private static async _axiosValidation(link: string): Promise<ValidationResult> {
    try {
      const agent = new https.Agent({
        // to accept poorly configured partner websites and disable the codeQL CD Warning
        // codeql[js/disabled-certificate-validation]: disable
        rejectUnauthorized: false
      })

      const response = await axios.get(link, {
        timeout: 5000,
        httpsAgent: agent,
        headers: this._browserLikeHeaders(),
        // Axios throws by default on 4xx/5xx — handle status codes ourselves
        validateStatus: () => true
      })
      return this._classifyStatus(response.status)
    } catch {
      return ValidationResult.Uncertain
    }
  }

  private static async _playwrightValidation(link: string): Promise<ValidationResult> {
    const browser = await chromium.launch()
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      extraHTTPHeaders: {
        Referer: 'https://mission-transition-ecologique.beta.gouv.fr/',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        Connection: 'keep-alive'
      }
    })
    const page = await context.newPage()

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
    try {
      const response = await page.goto(link)
      // simulate some actions to bypass the bpi protection
      for (let i = 0; i < 10; i++) {
        await page.evaluate(() => window.scrollBy(0, Math.random() * 100))
        const x = Math.random() * 500 + 300
        const y = Math.random() * 500 + 100
        await page.mouse.move(x, y, { steps: 50 })
        await delay(Math.random() * 500)
      }

      if (!response) {
        return ValidationResult.Invalid
      }
      return this._classifyStatus(response.status())
    } catch {
      return ValidationResult.Invalid
    } finally {
      await browser.close()
    }
  }

  private static _isEnablePlaywright(): boolean {
    if (process.env['LINK_VALIDATOR_PLAYWRIGHT_ENABLE']) {
      return process.env['LINK_VALIDATOR_PLAYWRIGHT_ENABLE'] != 'false'
    }
    return true
  }
}
