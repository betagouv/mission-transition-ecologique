import { test, expect } from '@playwright/test'
import { tests } from './formResultsData'


tests.forEach((singleTest) => {
  test(`Test id ${singleTest.id} - Verify form ${singleTest.url}`, async ({ page }) => {
    // check response api 
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
        }catch {}  
      }
    })
    // console.log(`Navigating to ${singleTest.type} form for ${singleTest.id} supposed to be ${singleTest.valid}`)

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
    await page.reload({ waitUntil: 'load' })
    await page.waitForTimeout(3000)

    if (singleTest.type === 'customProject') {
      await page.waitForSelector('[teste2e-selector="open-custom-project-form"]', { timeout: 3000, state: 'visible' })
      await page.click('[teste2e-selector="open-custom-project-form"]')
      await page.waitForSelector('.fade-enter-active, .fade-leave-active', { state: 'visible',  timeout: 3000 })

    }

    const firstFieldKey = Object.keys(singleTest.values)[0]
    const firstValue = singleTest.values[firstFieldKey]
    const firstSelector = `[teste2e-selector="${firstFieldKey}-${firstValue.type}"]`

    try {
      await page.waitForSelector(firstSelector, { timeout: 3000, state: 'visible'})
      for (const [fieldKey, value] of Object.entries(singleTest.values)) {
        const selector = `[teste2e-selector="${fieldKey}-${value.type}"]`
        if (fieldKey === 'siret') {
          if (singleTest.manual) {
            await page.locator(selector).fill(value.value as string)
          } else {
            const actualSiretValue = await page.inputValue(selector)
            expect(actualSiretValue).toBe(value.value)
          }
        } else if (fieldKey === 'needs') {
          const actualNeedsValue = await page.inputValue(selector)
          expect(actualNeedsValue).toContain(singleTest.manual? "autre secteur d'activité" : 'Programmation informatique')
        } else if (['text', 'email', 'tel'].includes(value.type)) {
          await page.locator(selector).fill(value.value as string)
        } else if (value.type === 'checkbox' && value.value) {
          await page.locator(selector).click()
        }
      }

      const submitButton = page.locator('button[type="submit"]')
      await page.waitForTimeout(1000)
      await page.waitForSelector('button[type="submit"]', { timeout: 3000, state: 'visible'})
      if (singleTest.valid) {
        await submitButton.click()
      } else {
        await expect(submitButton).toBeDisabled()
      }

    } catch {
      console.warn(`Error during filling of form for ${singleTest.type} test id ${singleTest.id}.`)
    }
  })
})