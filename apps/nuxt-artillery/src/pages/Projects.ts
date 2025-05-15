import { BasePage } from './BasePage'

/**
 * Projects class
 */
export class Projects extends BasePage {
  private readonly path = '/projets-entreprise'

  async navigate(): Promise<void> {
    await this.step('Projects list page', async () => {
      await this.page.goto(`${this.path}`)
      this.log('Visited project list page')
      await this.waitForLoad()
    })
  }

  async visitProjectPages(): Promise<void> {
    await this.step('Visit project page', async () => {
      const projectLinks = await this.getProjectLinks()

      for (const projectLink of projectLinks) {
        await this.page.goto(`${projectLink}`)
        this.log(`Visited project page: ${projectLink}`)
        await this.waitForLoad()
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
