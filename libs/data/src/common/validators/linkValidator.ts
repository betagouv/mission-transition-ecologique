/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import fetch from 'node-fetch'
import https from 'https'
import { chromium } from 'playwright'

export class LinkValidator {
  public static async isValidLink(link: string) {
    let result = await this._fetchValidation(link)
    await new Promise((resolve) => setTimeout(resolve, 50))
    if (!result) {
      result = await this._axiosValidation(link)
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
    if (!result && this._isEnablePlaywright()) {
      result = await this._playwrightValidation(link)
    }
    return result
  }

  private static async _fetchValidation(link: string) {
    try {
      const fetchResponse = await fetch(link, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(2000) })
      if (fetchResponse.ok) {
        return true
      } else {
        return false
      }
    } catch (error: any) {
      // mandatory linter comment
    }
    return false
  }

  private static async _axiosValidation(link: string) {
    try {
      const agent = new https.Agent({
        // to accept poorly configured partner websites and diasable the codeQl CD Warning
        // codeql[js/disabled-certificate-validation]: disable
        rejectUnauthorized: false
      })

      const response = await axios.get(link, { timeout: 2000, httpsAgent: agent })
      if (response.status < 300) {
        return true
      }
    } catch (error: any) {
      // mandatory linter comment
    }
    return false
  }

  private static async _playwrightValidation(link: string): Promise<boolean> {
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
      if (response && response.status() < 400) {
        return true
      } else {
        return false
      }
    } catch (error) {
      return false
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
