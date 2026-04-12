import { expect, test } from '@nuxt/test-utils/playwright'
import { tests } from './projectResultsData'
import { timeOut } from '../config'

tests.forEach((singleTest) => {
  test(`Test id ${singleTest.id} - Verify content and elements for query ${singleTest.url}`, async ({ page, goto }) => {
    await goto(singleTest.url, { waitUntil: 'hydration' })

    const expectedCount = singleTest.count ?? singleTest.values.length
    const locator = page.locator('.teste2e-project-target h3 a')

    // auto-retrying assertion: waits until the expected number of elements appear
    await expect(locator).toHaveCount(expectedCount, { timeout: timeOut })

    const elementsLocal = await locator.evaluateAll((els) => els.map((el) => el.innerHTML.trim()))
    for (let i = 0; i < elementsLocal.length; i++) {
      expect(elementsLocal[i]).toBe(singleTest.values[i])
    }
  })
})
