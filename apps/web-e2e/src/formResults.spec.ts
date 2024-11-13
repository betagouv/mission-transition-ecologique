import { test, expect } from '@playwright/test'
import { tests } from './formResultsData'

/**
 * Test the number of programs proposed as a result of a list of queries and their order.
 */
tests.forEach((singleTest) => {
  test(`Test id ${singleTest.id} - Verify form ${singleTest.url}`, async ({ page }) => {

    page.on('response', async (response) => {
      if (response.url().includes('/api/opportunities')) {
        if (response.status() === 200) {
          await expect(page.locator('[teste2e-selector="success-callback-contact-form"]')).toBeVisible({ timeout: 1000 })
        } else {
          console.log('error during opportunityApiCall')
          await expect(page.locator('[teste2e-selector="error-callback-contact-form"]')).toBeVisible({ timeout: 1000 })
        }
      }
    });
    console.log(`Navigating to ${singleTest.type} ${singleTest.id} ${singleTest.valid}`)
    await page.goto(singleTest.url, { waitUntil: 'load' })
    if (singleTest.type === 'custom-project') {
      await page.click('[teste2e-selector="open-custom-project-form"]')
    }

    for (const [fieldKey, value] of Object.entries(singleTest.values)) {
      const selector = `[teste2e-selector="${fieldKey}-${value.type}"]`
      
      try {
        await page.waitForSelector(selector, { timeout: 3000 })
        if (['text', 'email', 'tel'].includes(value.type)) {
          await page.locator(selector).fill(value.value as string)
        } else if (value.type === 'select') {
          await page.locator(selector).selectOption({ label: value.value as string })
        } else if (value.type === 'checkbox' && value.value) {
          await page.locator(selector).click()
        }
      } catch {
        console.warn(`Sélecteur ${selector} non trouvé pour le test id ${singleTest.id}.`)
        continue
      }
    }

    const submitButton = page.locator('[teste2e-selector="send-contact-form"]');
    await submitButton.waitFor({ state: 'attached', timeout: 1000 })
    await page.waitForTimeout(1000);
    if (singleTest.valid) {
      await expect(submitButton).not.toBeDisabled()

      await submitButton.click()
    } else {
      await expect(submitButton).toBeDisabled()
    } 
  })
})