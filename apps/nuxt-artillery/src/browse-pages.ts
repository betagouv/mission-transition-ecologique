import { Page } from 'playwright'
import { TestType } from 'playwright/types/test'
import { Homepage, Programs, Projects } from './pages'

/**
 * Artillery calls this function to navigate through the website
 *
 * @param page - Playwright page object
 * @param context - Artillery context
 * @param events - Artillery events
 * @param test - Playwright test object
 */
async function browsePages(page: Page, context: { vars: { target: string } }, events: unknown, test: TestType<any, any>): Promise<void> {
  try {
    console.log('Starting page navigation...')
    const { step } = test

    // Initialize page objects
    const homepage = new Homepage(page, step)
    const programs = new Programs(page, step)
    const projects = new Projects(page, step)

    // Navigate through pages
    await homepage.navigate()

    // Visit program pages
    await programs.navigate()
    await programs.visitProgramPages()

    // Visit project pages
    await projects.navigate()
    await projects.visitProjectPages()
  } catch (error) {
    console.error('Error during page navigation:', error)
  }
}

export { browsePages }
