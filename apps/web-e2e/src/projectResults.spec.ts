import { test, expect } from '@playwright/test'
import { tests } from './projectResultsData'
import { timeOut } from './config'

tests.forEach((singleTest) => {
  test(`Test id ${singleTest.id} - Verify content and elements for query ${singleTest.url}`, async ({ page }) => {
    await page.goto(singleTest.url)
    try {
      await page.locator('.teste2e-project-target').waitFor( {state: 'visible', timeout: timeOut })
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

test(`Check projects found while initially selecting different tags`, async ({ page }) => {
  const urlTag1 = 'questionnaire/resultat?choix-du-parcours=j-ai-un-projet&siret=83014132100034&effectif=TPE&objectifs=mobility'
  const urlTag2 = 'questionnaire/resultat?choix-du-parcours=j-ai-un-projet&siret=83014132100034&effectif=TPE&objectifs=building'

  await page.goto(urlTag1)
  try {
    await page.locator('.teste2e-project-target').waitFor( {state: 'visible', timeout: timeOut })
  } catch (error) {
    // this is an expected error that can happen
    // - if the number of results is 0
    // - in some mobile data browser
  }
  const elementsurlTag1 = await page.$$eval('.teste2e-project-target h3 a', (els) => els.map((el) => el.innerHTML.trim()))
  await page.goto(urlTag2)
  try {
    await page.waitForSelector('.teste2e-project-target', { timeout: timeOut })
  } catch (error) {
    // this is an expected error that can happen
    // - if the number of results is 0
    // - in some mobile data browser
  }
  await page.click('//button[normalize-space(.)="🚲 mobilité"]')

  const elementsurlTag2 = await page.$$eval('.teste2e-project-target h3 a', (els) => els.map((el) => el.innerHTML.trim()))

  expect(elementsurlTag1.length).toBe(elementsurlTag2.length)
  for (let i = 0; i < elementsurlTag2.length; i++) {
    expect(elementsurlTag1[i]).toBe(elementsurlTag2[i])
  }
})
