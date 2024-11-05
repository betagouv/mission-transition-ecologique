import { test, expect } from '@playwright/test'
import { tests } from './formResultsData'
import { FormDataType } from '@/types'

/**
 * Test the number of programs proposed as a result of a list of queries and their order.
 */
tests.forEach((singleTest) => {
  test(`Test id ${singleTest.id} - Verify form ${singleTest.url}`, async ({ page }) => {
    await page.goto(singleTest.url)
    try {
      Object.keys(FormDataType).forEach((fieldKey) => {
        await page.locator(`[data-testid="${fieldKey}"]`).fill('John Doe');

      })
    } catch (error) {
      // this is an expected error what can happen
      // - if the number of results is 0
      // - in some mobile data browser
    }
    const elementsLocal = await page.$$eval('.teste2e-program-target', (els) => els.map((el) => el.innerHTML.trim()))

    // console.warn(singleTest.values)
    // console.warn(elementsLocal)

    expect(elementsLocal.length).toBe(singleTest.count ?? singleTest.values.length)
    if (singleTest.count < 100) {
      for (let i = 0; i < elementsLocal.length; i++) {
        expect(elementsLocal[i]).toBe(singleTest.values[i])
      }
    }
  })
})
