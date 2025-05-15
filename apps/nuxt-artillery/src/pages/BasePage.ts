import { Page } from 'playwright'
import { TestType } from 'playwright/types/test'

/**
 * Base class for all pages
 */
export abstract class BasePage {
  constructor(
    protected page: Page,
    protected step: TestType<any, any>['step']
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

  /**
   * Log a message
   */
  protected log(message: string): void {
    console.log(message)
  }
}
