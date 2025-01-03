import { test, expect } from '@playwright/test'
import { tests } from './formResultsData'
import { timeOut } from './config'


tests.forEach((singleTest) => {
  test(`Test id ${singleTest.id} - Verify form ${singleTest.url}`, async ({ page }) => {
    try {
      page.on('response', async (response) => {
        if (response.url().includes('/api/opportunities')) {
          try {
            await page.locator('[teste2e-selector="callback-contact-form"]').waitFor({ timeout: timeOut, state: 'visible' })
            if (response.status() === 200) {
              await expect(page.locator('[teste2e-selector="success-callback-contact-form"]')).toBeVisible({ timeout: timeOut })
            } else {
              console.log('error during opportunityApiCall');
              await expect(page.locator('[teste2e-selector="error-callback-contact-form"]')).toBeVisible({ timeout: timeOut })
            }
          } catch (e) {
            throw new Error(`Error handling API response: ${e.message}`)
          }
        }
      })
      await page.goto(singleTest.url, { waitUntil: 'load' })
      await page.waitForLoadState('networkidle')
      await page.evaluate((singleTest) => {
        if (singleTest.manual) {
          localStorage.setItem(
            'company',
            JSON.stringify({
              denomination: 'Entreprise : Aide par le travail - Bretagne',
              region: 'Bretagne',
              ville: 'Brest',
              codePostal: '29200',
              secteur: 'Aide par le travail',
              codeNAF: '88.10C',
              codeNAF1: 'Q'
            })
          )
        } else {
          localStorage.setItem(
            'company',
            JSON.stringify({
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
            })
          )
        }
        localStorage.setItem('structure_size', JSON.stringify('TPE'))
      }, singleTest)

      await page.reload({ waitUntil: 'load' })
      await page.waitForLoadState('networkidle')

      if (singleTest.type === 'customProject') {
        await page.waitForSelector('[teste2e-selector="open-custom-project-form"]', {
          timeout: timeOut,
          state: 'visible',
        })
        await page.click('[teste2e-selector="open-custom-project-form"]', { timeout: timeOut })
      }
      await expect(page.locator(`form[name="${singleTest.type}"]`)).toHaveCount(1, { timeout: timeOut })
      for (const [fieldKey, value] of Object.entries(singleTest.values)) {
        const selector = `[teste2e-selector="${fieldKey}-${value.type}"]`

        try {
          if (fieldKey === 'siret') {
            if (singleTest.manual) {
              await page.locator(selector).fill(value.value as string, { timeout: timeOut })
            } else {
              const actualSiretValue = await page.inputValue(selector)
              expect(actualSiretValue).toBe(value.value)
            }
          } else if (fieldKey === 'needs') {
            const actualNeedsValue = await page.inputValue(selector)
            expect(actualNeedsValue).toContain(singleTest.manual ? 'Aide par le travail' : 'Programmation informatique')
          } else if (['text', 'email', 'tel'].includes(value.type)) {
            await page.locator(selector).fill(value.value as string, { timeout: timeOut })
          } else if (value.type === 'select' && singleTest.type === 'customProject') {
            await page.locator(selector).selectOption({ label: value.value as string })
          } else if (value.type === 'checkbox' && value.value) {
            await page.locator(selector).click({ force: true, timeout: timeOut })
          }
        } catch (e) {
          throw new Error(`Error processing field ${fieldKey}: ${e.message}`)
        }
      }

      const submitButton = page.locator('button[type="submit"]')
      await expect(submitButton).toHaveCount(1, { timeout: timeOut })

      if (singleTest.valid) {
        await expect(submitButton).toBeEnabled({ timeout: timeOut })
        await submitButton.click({ force: true, timeout: timeOut })
      } else {
        await expect(submitButton).toBeDisabled({ timeout: timeOut })
      }
    } catch (e) {
      console.error(`Test failed for Test ID: ${singleTest.id} - ${e.message}`)
      throw e
    }
  })
})
