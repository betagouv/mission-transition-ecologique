import { test, expect } from '@playwright/test'
import { tests } from './formResultsData'


tests.forEach((singleTest) => {
  test(`Test id ${singleTest.id} - Verify form ${singleTest.url}`, async ({ page }) => {
    // check response api 
    page.on('response', async (response) => {
      if (response.url().includes('/api/opportunities')) {
        await page.locator('[teste2e-selector="callback-contact-form"]').waitFor()
        if (response.status() === 200) {
          await expect(page.locator('[teste2e-selector="success-callback-contact-form"]')).toBeVisible({ timeout: 3000 })
        } else {
          console.log('error during opportunityApiCall')
          await expect(page.locator('[teste2e-selector="error-callback-contact-form"]')).toBeVisible({ timeout: 3000 })
        }
      }
    });
    console.log(`Navigating to ${singleTest.type} form for ${singleTest.id} supposed to be ${singleTest.valid}`)

    await page.goto(singleTest.url, { waitUntil: 'load' })
    // save company data in localStorage
    if (singleTest.manual) {
      await page.evaluate(() => {
        localStorage.setItem('company', JSON.stringify(
          {
            denomination: 'Entreprise : tertiaire - Bretagne',
            region: 'Bretagne',
            secteur: 'tertiaire'
          }
        ))
        localStorage.setItem('structure_size', 'TPE')
      })  
    } else {
      await page.evaluate(() => {
        localStorage.setItem('company', JSON.stringify(
          {
            ville: 'FONTENAY-SOUS-BOIS',
            structure_size: 'TPE',
            siret: '83014132100034',
            secteur: 'Programmation informatique',
            region: 'Île-de-France',
            legalCategory: '5710',
            denomination: 'MULTI',
            creationDate: '2017-06-01',
            codePostal: '94120',
            codeNAF1: 'J',
            codeNAF: '62.01Z'
          }
        ))
      localStorage.setItem('structure_size', 'TPE')
      })
    }
    await page.reload()

    if (singleTest.type === 'customProject') {
      await page.waitForSelector('[teste2e-selector="open-custom-project-form"]', { timeout: 3000 })
      await page.click('[teste2e-selector="open-custom-project-form"]')
      await page.waitForSelector('.fade-enter-active, .fade-leave-active', { state: 'detached' })

    }

    try {
      await page.locator(`form[name="${singleTest.type}"]`).waitFor()
      for (const [fieldKey, value] of Object.entries(singleTest.values)) {
        const selector = `[teste2e-selector="${fieldKey}-${value.type}"]`
        if (fieldKey === 'siret') {
          const actualSiretValue = await page.inputValue(selector)
          expect(actualSiretValue).toBe(value.value)
        } else if (fieldKey === 'needs') {
          const actualNeedsValue = await page.inputValue(selector)
          expect(actualNeedsValue).toContain(singleTest.manual? 'tertiaire' : 'Programmation informatique')
        } else if (['text', 'email', 'tel'].includes(value.type)) {
          await page.locator(selector).fill(value.value as string)
        } else if (value.type === 'select') {
          await page.locator(selector).selectOption({ label: value.value as string })
        } else if (value.type === 'checkbox' && value.value) {
          await page.locator(selector).click()
        }
      }

    } catch {
      console.warn(`Form not found for test id ${singleTest.id}.`)
    }

    const submitButton = page.locator('button[type="submit"]');
    await submitButton.waitFor({ state: 'attached', timeout: 1000 })
    await page.waitForTimeout(3000)
    if (singleTest.valid) {
      await expect(submitButton).not.toBeDisabled()
      await submitButton.click()
    } else {
      await expect(submitButton).toBeDisabled()
    }
  })
})