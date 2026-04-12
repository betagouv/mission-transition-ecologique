import { expect, test } from '@nuxt/test-utils/playwright'
import { tests } from './programResultsData'
import { timeOut } from '../config'

/**
 * Test the number of programs proposed as a result of a list of queries and their order.
 */
tests.forEach((singleTest) => {
  test(`Test id ${singleTest.id} - Verify programs number and order for query ${singleTest.url}`, async ({ page, goto }) => {
    await goto(singleTest.url, { waitUntil: 'hydration' })

    const expectedCount = singleTest.count ?? singleTest.values.length
    const cardsLocator = page.locator('.fr-card--program .fr-card__title a')

    // auto-retrying assertion: waits until the expected number of elements appear
    await expect(cardsLocator).toHaveCount(expectedCount, { timeout: timeOut })

    if (!singleTest.count || singleTest.count < 100) {
      const elementsLocal = await cardsLocator.evaluateAll((els) => els.map((el) => el.innerHTML.trim()))
      for (let i = 0; i < elementsLocal.length; i++) {
        expect(elementsLocal[i]).toBe(singleTest.values[i])
      }
    }
  })
})
