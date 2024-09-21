/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from 'axios'
import fetch from 'node-fetch'
import https from 'https'
// import { chromium } from 'playwright'

export class LinkValidator {
  public static async isValidLink(link: string) {
    let result = await this._fetchValidation(link)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    if (!result) {
      result = await this._axiosValidation(link)
    }
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // if (!result) {
    // result = await this._playwrightValidation(link)
    // }
    return result
  }

  private static async _fetchValidation(link: string) {
    try {
      const fetchResponse = await fetch(link, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(2000) })
      if (fetchResponse.ok) {
        return true
      } else {
        console.log('fetch rejected with status ', fetchResponse.status, link)
        return false
      }
    } catch (error: any) {
      console.log('fetch failed, ', (error as any).code, link)
    }
    return false
  }

  private static async _axiosValidation(link: string) {
    await new Promise((resolve) => setTimeout(resolve, 2000))

    try {
      const agent = new https.Agent({
        // to accept poorly configured partner websites
        rejectUnauthorized: false
      })
      const headers = {
        // to be recognized by partner websites that ban robots
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        Referer: 'https://mission-transition-ecologique.beta.gouv.fr/',
        Connection: 'keep-alive'
      }

      const response = await axios.get(link, { headers, timeout: 10000, httpsAgent: agent })
      if (response.status < 300) {
        return true
      } else {
        console.log('link status : ', response.status, link)
      }
    } catch (error: any) {
      console.log('2nd axios error: ', error.code, link)
      const axiosError = error as AxiosError
      if (axiosError.response) {
        console.error(`Error accessing ${link}:`, axiosError.response.status, axiosError.response.statusText)
        if (axiosError.response.status === 403) {
          console.error(`Access denied (403) for ${link}.`)
        }
      } else {
        console.error(`Error accessing ${link}:`, axiosError.message)
      }
    }
    return false
  }

  // private static async _playwrightValidation(link: string): Promise<boolean> {
  //   const browser = await chromium.launch()
  //   const context = await browser.newContext({
  //     userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  //     extraHTTPHeaders: {
  //       Referer: 'https://mission-transition-ecologique.beta.gouv.fr/',
  //       Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  //       'Accept-Language': 'en-US,en;q=0.5',
  //       Connection: 'keep-alive'
  //     }
  //   })
  //   const page = await context.newPage()

  //   const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
  //   try {
  //     const response = await page.goto(link)
  //     for (let i = 0; i < 10; i++) {
  //       await page.evaluate(() => window.scrollBy(0, Math.random() * 100))
  //       const x = Math.random() * 500 + 300
  //       const y = Math.random() * 500 + 100
  //       await page.mouse.move(x, y, { steps: 50 })
  //       await delay(Math.random() * 500)
  //     }
  //     // await delay(5000)
  //     console.log('waitint number2 ')
  //     if (response && response.status() < 400) {
  //       return true
  //     } else {
  //       console.error(`Playwright failed to access ${link}`, response?.status())
  //       return false
  //     }
  //   } catch (error) {
  //     console.error(`Playwright Error accessing ${link}:`, error)
  //     return false
  //   } finally {
  //     await browser.close()
  //   }
  // }
}
