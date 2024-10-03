import { test, expect } from '@playwright/test'
import { tests } from './programResultsData'

/**
 * Test the number of programs proposed as a result of a list of queries and their order.
 */
tests.forEach((singleTest) => {
  test(`Verify programs number and order for query ${singleTest.url}`, async ({ page }) => {
    await page.goto(singleTest.url)
    try {
      await page.waitForSelector('.teste2e-program-target', { timeout: 3000 })
    } catch (error) {
      // this is an expected error what can happen
      // - if the number of results is 0
      // - in some mobile data browser
    }
    const elementsLocal = await page.$$eval('.teste2e-program-target', (els) => els.map((el) => el.innerHTML.trim()))

    expect(elementsLocal.length).toBe(singleTest.count)
    if (singleTest.count < 100) {
      for (let i = 0; i < elementsLocal.length; i++) {
        expect(elementsLocal[i]).toBe(singleTest.values[i])
      }
    }
  })
})
