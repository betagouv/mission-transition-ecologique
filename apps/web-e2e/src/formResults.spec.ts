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
        await page.fill(selector, value.value as string)
      } else if (value.type === 'select') {
        // Sélectionner une option dans un champ de type select
        await page.selectOption(selector, { label: value.value as string });
      } else if (value.type === 'checkbox') {
        if (value.value) {
          await page.check(selector)
        } else {
          await page.uncheck(selector)
        }
      } 
    }
    await page.click('[teste2e-selector="send-contact-form"]')
    await expect(page.locator('[teste2e-selector="callback-contact-form"]')).toBeVisible()
  })
})
