import { Page } from 'playwright'
import { TestType } from 'playwright/types/test'

/**
 * Base class for all pages
 */
export abstract class BasePage {
  constructor(
    protected page: Page,
    protected step: TestType<any, any>['step'],
    protected withRefresh = false,
    /**
     * Maximum number of sub-pages to visit when iterating a list.
     * undefined = visit all (default behaviour used by browse-pages.ts)
     */
    protected maxPages?: number,
    /**
     * Think time range in ms to pause between page visits, simulating user reading time.
     * undefined = no pause (default behaviour used by browse-pages.ts)
     */
    protected thinkTime?: { min: number; max: number }
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
   * Pause for a random duration within the configured think time range.
   * No-op when thinkTime is undefined.
   */
  protected async pause(): Promise<void> {
    if (!this.thinkTime) {
      return
    }
    const { min, max } = this.thinkTime
    const delay = Math.floor(Math.random() * (max - min + 1)) + min
    await this.page.waitForTimeout(delay)
  }

  /**
   * Shuffle a copy of an array using the Fisher-Yates algorithm
   */
  protected shuffle<T>(arr: T[]): T[] {
    const copy = [...arr]
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[copy[i], copy[j]] = [copy[j], copy[i]]
    }
    return copy
  }

  /**
   * Log a message
   */
  protected log(message: string): void {
    console.log(message)
  }
}
