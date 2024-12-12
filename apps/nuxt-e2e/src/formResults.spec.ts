import { expect, test } from '@nuxt/test-utils/playwright'
import { tests } from './formResultsData'

tests.forEach((singleTest) => {
  test(`Test id ${singleTest.id} - Verify form ${singleTest.url}`, async ({ page, goto }) => {
    try {
      page.on('response', async (response) => {
        if (response.url().includes('/api/opportunities')) {
          try {
            await page.locator('[teste2e-selector="callback-contact-form"]').waitFor({ timeout: 3000, state: 'visible' })
            if (response.status() === 200) {
              await expect(page.locator('[teste2e-selector="success-callback-contact-form"]')).toBeVisible({ timeout: 3000 })
            } else {
              console.log('error during opportunityApiCall')
              await expect(page.locator('[teste2e-selector="error-callback-contact-form"]')).toBeVisible({ timeout: 3000 })
            }
          } catch (e: unknown) {
            throw new Error(`Error handling API response: ${(e as Error).message}`)
          }
        }
      })
      await goto(singleTest.url, { waitUntil: 'hydration' })

      await page.evaluate((singleTest) => {
        if (singleTest.manual) {
          localStorage.setItem(
            'company',
            JSON.stringify({
              denomination: 'Entreprise : tertiaire - Bretagne',
              region: 'Bretagne',
              secteur: 'tertiaire'
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

      // reload the page to apply the localStorages
      await goto(singleTest.url, { waitUntil: 'hydration' })

      if (singleTest.type === 'customProject') {
        await page.waitForSelector('[teste2e-selector="open-custom-project-form"]', {
          timeout: 3000,
          state: 'visible'
        })
        await page.click('[teste2e-selector="open-custom-project-form"]', { timeout: 3000 })
      }
      await expect(page.locator(`form[name="${singleTest.type}"]`)).toHaveCount(1, { timeout: 3000 })
      for (const [fieldKey, value] of Object.entries(singleTest.values)) {
        const selector = `[teste2e-selector="${fieldKey}-${value.type}"]`

        try {
          if (fieldKey === 'siret') {
            if (singleTest.manual) {
              await page.locator(selector).fill(value.value as string, { timeout: 3000 })
            } else if (value.value) {
              await expect(page.locator(selector)).toHaveValue(value.value as string)
            }
          } else if (fieldKey === 'needs') {
            const actualNeedsValue = await page.inputValue(selector)
            expect(actualNeedsValue).toContain(singleTest.manual ? 'tertiaire' : 'Programmation informatique')
          } else if (['text', 'email', 'tel'].includes(value.type)) {
            await page.locator(selector).fill(value.value as string, { timeout: 3000 })
          } else if (value.type === 'select' && singleTest.type === 'customProject') {
            await page.locator(selector).selectOption({ label: value.value as string })
          } else if (value.type === 'checkbox' && value.value) {
            await page.locator(selector).click({ force: true, timeout: 3000 })
          }
        } catch (e) {
          throw new Error(`Error processing field ${fieldKey}: ${(e as Error).message}`)
        }
      }

      const submitButton = page.locator('button[type="submit"]')
      await expect(submitButton).toHaveCount(1, { timeout: 3000 })

      if (singleTest.valid) {
        await expect(submitButton).toBeEnabled({ timeout: 3000 })
        await submitButton.click({ force: true, timeout: 3000 })
      } else {
        await expect(submitButton).toBeDisabled({ timeout: 3000 })
      }
    } catch (e) {
      console.error(`Test failed for Test ID: ${singleTest.id} - ${(e as Error).message}`)
      throw e
    }
  })
})
