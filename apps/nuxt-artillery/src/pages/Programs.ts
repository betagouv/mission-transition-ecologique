import { BasePage } from './BasePage'

/**
 * Programs class
 */
export class Programs extends BasePage {
  private readonly _path = '/aides-entreprise'

  async navigate(): Promise<void> {
    await this.step('Programs list page', async () => {
      await this.refreshPage()
      await this.page.goto(`${this._path}`)
      this.log('Visited program list page')
      await this.waitForLoad()
    })
  }

  async visitProgramPages(): Promise<void> {
    await this.step('Visit program page', async () => {
      const programLinks = await this.getProgramLinks()

      for (const programLink of programLinks) {
        await this.refreshPage()
        await this.page.goto(`${programLink}`)
        this.log(`Visited program page: ${programLink}`)
        await this.waitForLoad()
      }
    })
  }

  async getProgramLinks(): Promise<(string | null)[]> {
    return await this.page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('.fr-card a[href^="/aides-entreprise/"]'))
      return links.map((link) => link.getAttribute('href'))
    })
  }
}
