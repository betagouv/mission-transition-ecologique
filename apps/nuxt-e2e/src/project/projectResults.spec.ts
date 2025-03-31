import { expect, test } from '@nuxt/test-utils/playwright'
import { tests } from './projectResultsData'
import { timeOut } from '../config'

tests.forEach((singleTest) => {
  test(`Test id ${singleTest.id} - Verify content and elements for query ${singleTest.url}`, async ({ page, goto }) => {
    await goto(singleTest.url, { waitUntil: 'hydration' })
    try {
      await page.locator('.teste2e-project-target').waitFor({ state: 'visible', timeout: timeOut })
    } catch (error) {
      // this is an expected error that can happen
      // - if the number of results is 0
      // - in some mobile data browser
    }
    const elementsLocal = await page.$$eval('.teste2e-project-target h3 a', (els) => els.map((el) => el.innerHTML.trim()))

    // console.warn(singleTest.values)
    // console.warn(elementsLocal)

    expect(elementsLocal.length).toBe(singleTest.count ?? singleTest.values.length)
    for (let i = 0; i < elementsLocal.length; i++) {
      expect(elementsLocal[i]).toBe(singleTest.values[i])
    }
  })
})
