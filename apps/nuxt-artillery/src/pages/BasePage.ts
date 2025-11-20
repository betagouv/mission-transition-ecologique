import { Page } from 'playwright'
import { TestType } from 'playwright/types/test'

/**
 * Base class for all pages
 */
export abstract class BasePage {
  constructor(
    protected page: Page,
    protected step: TestType<any, any>['step'],
    protected withRefresh = false
  ) {}
  /**
   * Navigate to the page
   */
  abstract navigate(): Promise<void>

  /**
   * Wait for the page to load
   */
  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle')
  }

  async refreshPage(): Promise<void> {
    if (this.withRefresh) {
      await this.page.reload()
      await this.waitForLoad()
    }
  }

  /**
   * Log a message
   */
  protected log(message: string): void {
    console.log(message)
  }
}
