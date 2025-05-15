import { BasePage } from './BasePage'

/**
 * Homepage class
 */
export class Homepage extends BasePage {
  async navigate(): Promise<void> {
    await this.step('Homepage', async () => {
      await this.page.goto('/')
      this.log('Visited home page')
      await this.waitForLoad()
    })
  }
}
