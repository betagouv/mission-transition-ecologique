import { test, expect } from '@playwright/test'
import { tests } from './formResultsData'

/**
 * Test the number of programs proposed as a result of a list of queries and their order.
 */
tests.forEach((singleTest) => {
  test(`Test id ${singleTest.id} - Verify form ${singleTest.url}`, async ({ page }) => {
    console.log(`Navigating to ${singleTest.url}`)
    await page.goto(singleTest.url, { waitUntil: 'networkidle' })
    if (singleTest.type === 'custom-project') {
      await page.click('[teste2e-selector="open-custom-project-form"]')
    }

    for (const [fieldKey, value] of Object.entries(singleTest.values)) {
      const selector = `[teste2e-selector="${fieldKey}-${value.type}"]`
      
      try {
        console.log(`Waiting for selector ${selector} for Test ID ${singleTest.id}`)
        await page.waitForSelector(selector, { timeout: 3000 })
      } catch {
        console.warn(`Sélecteur ${selector} non trouvé pour le test id ${singleTest.id}.`)
        continue; // Passer à l'élément suivant si le sélecteur est introuvable
      }

      if (value.type === 'text') {
        await page.locator(`${selector}`).locator('input[type="text"]').fill(value.value as string)
        console.log(`selector ${selector} is filled with ${value.value}`)
      } else if (value.type === 'select') {
        await page.locator(`${selector}`).locator('select').selectOption({ label: value.value as string })
        console.log(`selector ${selector} is filled with ${value.value}`)
      } else if (value.type === 'checkbox' && value.value) {
        await page.locator(`${selector} label`).click()
        console.log(`selector ${selector} is filled with ${value.value}`)
      }
    }

    const submitButton = page.locator('[teste2e-selector="send-contact-form"]');
    await submitButton.waitFor({ state: 'attached', timeout: 5000 })
    await page.waitForTimeout(1000);
    if (singleTest.valid) {
      await expect(submitButton).not.toBeDisabled()

      await submitButton.click()
  
      const expectedCallbackSelector = singleTest.valid 
        ? '[teste2e-selector="success-callback-contact-form"]' 
        : '[teste2e-selector="error-callback-contact-form"]'
  
      await expect(page.locator(expectedCallbackSelector)).toBeVisible({ timeout: 10000 })
    }
  })
})