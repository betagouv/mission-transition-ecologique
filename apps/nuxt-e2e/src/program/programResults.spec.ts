import { expect, test } from '@nuxt/test-utils/playwright'
import { tests } from './programResultsData'
import { timeOut } from '../config'

/**
 * Test the number of programs proposed as a result of a list of queries and their order.
 */
tests.forEach((singleTest) => {
  test(`Test id ${singleTest.id} - Verify programs number and order for query ${singleTest.url}`, async ({ page, goto }) => {
    await goto(singleTest.url, { waitUntil: 'hydration' })
    try {
      await page.locator('.fr-card--program .fr-card__title a').waitFor({ state: 'visible', timeout: timeOut })
    } catch (error) {
      // this is an expected error what can happen
      // - if the number of results is 0
      // - in some mobile data browser
    }
    const elementsLocal = await page.$$eval('.fr-card--program .fr-card__title a', (els) => els.map((el) => el.innerHTML.trim()))

    // logs to analyse the error and easily reset the test case if needed (volontary filter changes)
    // console.log(
    //   'elements trouvés non attendu',
    //   elementsLocal.filter((el) => !singleTest.values.includes(el))
    // )
    // console.log(
    //   'elements non trouvés attendus',
    //   singleTest.values.filter((el) => !elementsLocal.includes(el))
    // )
    // console.warn(singleTest.values)
    // console.warn(elementsLocal)

    expect(elementsLocal.length).toBe(singleTest.count ?? singleTest.values.length)

    if (!singleTest.count || singleTest.count < 100) {
      for (let i = 0; i < elementsLocal.length; i++) {
        expect(elementsLocal[i]).toBe(singleTest.values[i])
      }
    }
  })
})
