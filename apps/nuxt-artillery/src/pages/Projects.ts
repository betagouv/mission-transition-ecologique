import { BasePage } from './BasePage'

/**
 * Projects class
 */
export class Projects extends BasePage {
  private readonly _path = '/projets-entreprise'

  async navigate(): Promise<void> {
    await this.step('Projects list page', async () => {
      await this.refreshPage()
      await this.page.goto(`${this._path}`)
      this.log('Visited project list page')
      await this.waitForLoad()
    })
  }

  async visitProjectPages(): Promise<void> {
    await this.step('Visit project page', async () => {
      const allLinks = await this.getProjectLinks()
      const filtered = allLinks.filter((l): l is string => l !== null)
      // Shuffle only when maxPages is set; otherwise preserve original order
      const linksToVisit = this.maxPages !== undefined ? this.shuffle(filtered).slice(0, this.maxPages) : filtered

      for (const projectLink of linksToVisit) {
        await this.refreshPage()
        await this.page.goto(projectLink)
        this.log(`Visited project page: ${projectLink}`)
        await this.waitForLoad()
        await this.pause()
      }
    })
  }

  async getProjectLinks(): Promise<(string | null)[]> {
    return await this.page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('.fr-card a[href^="/projets-entreprise/"]'))
      return links.map((link) => link.getAttribute('href'))
    })
  }
}
