import { test, expect } from '@playwright/test'

const productionUrl = 'https://mission-transition-ecologique.beta.gouv.fr/'
const testUrl = 'http://localhost:4242/'

const queryUrls = [
  'projets-entreprise'
]

// compare the results between the PR branch and the production
queryUrls.forEach((queryUrl, id) => {
  test(`Verify content and elements for query number ${id}`, async ({ page }) => {
    const fullProductionUrl = `${productionUrl}${queryUrl}`
    const fullLocalUrl = `${testUrl}${queryUrl}`

    await page.goto(fullProductionUrl)
    try {
      await page.waitForSelector('div.fr-card--shadow', { timeout: 3000 })
    } catch (error) {
      // expected when no elements are found
      // it also happen in some other tests cases where there are elements for an unknown reason
    }
    const elementsProduction = await page.$$eval('div.fr-card--shadow > h3', (els) => els.map((el) => el.innerHTML.trim()))

    await page.goto(fullLocalUrl)
    try {
      await page.waitForSelector('div.fr-card--shadow', { timeout: 3000 })
    } catch (error) {
      // expected when no elements are found
      // it also happen in some other tests cases where there are elements for an unknown reason
    }
    const elementsLocal = await page.$$eval('div.fr-card--shadow > h3', (els) => els.map((el) => el.innerHTML.trim()))
    console.log(elementsProduction.length)

    expect(elementsLocal.length).toBe(elementsProduction.length)
    for (let i = 0; i < elementsProduction.length; i++) {
      expect(elementsProduction[i]).toBe(elementsLocal[i])
    }
  })
})

// check that clicking on a tag or directly loading the page with a tag selected gives the same result