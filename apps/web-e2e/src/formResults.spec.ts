import { test, expect } from '@playwright/test'
import { tests } from './formResultsData'

/**
 * Test the number of programs proposed as a result of a list of queries and their order.
 */
tests.forEach((singleTest) => {
  test(`Test id ${singleTest.id} - Verify form ${singleTest.url}`, async ({ page }) => {
    await page.goto(singleTest.url)
    if (singleTest.type === 'custom-project') {
      await page.click('[teste2e-selector="open-custom-project-form"]')
    } 
    for (const [fieldKey, value] of Object.entries(singleTest.values)) {
      const selector = `[teste2e-selector="${fieldKey}-${value.type}"]`
      await page.waitForSelector(selector, { timeout: 3000 })
      if (value.type === 'text') {
        await page.locator(`${selector}`).locator('input[type="text"]').fill(value.value as string)
      } else if (value.type === 'select') {
        await page.locator(`${selector}`).locator('select').selectOption({ label: value.value as string })
      } else if (value.type === 'checkbox') {
        if (value.value) {
          await page.locator(`${selector}`).locator('input[type="checkbox"]').check()
        } else {
          await page.locator(`${selector}`).locator('input[type="checkbox"]').uncheck()
        }
      } 
    }
    await page.click('[teste2e-selector="send-contact-form"]')
    if (singleTest.valid) {
      await expect(page.locator('[teste2e-selector="success-callback-contact-form"]')).toBeVisible()
    } else {
      await expect(page.locator('[teste2e-selector="error-callback-contact-form"]')).toBeVisible()
    } 
  })
})
