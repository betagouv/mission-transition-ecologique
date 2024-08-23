import { test, expect } from '@playwright/test'

const productionUrl = 'https://mission-transition-ecologique.beta.gouv.fr/'
const testUrl = 'http://localhost:4242/'

const queryUrls = [
  'projets-entreprise',
  'questionnaire/resultat?choix-du-parcours=je-ne-sais-pas-par-ou-commencer&siret=83014132100034&effectif=TPE&locaux=proprietaire&mobilite=oui&matieres-premieres=oui&tri-dechets=non&dechets=oui&gestion-eau=oui&energie=non&audit=non#questionnaire-resultat',
  'questionnaire/resultat?choix-du-parcours=je-ne-sais-pas-par-ou-commencer&siret=78893947800020&locaux=locataire&mobilite=oui&matieres-premieres=oui&tri-dechets=oui&dechets=oui&gestion-eau=oui&energie=oui&audit=non#questionnaire-resultat',
  'questionnaire/resultat?choix-du-parcours=je-ne-sais-pas-par-ou-commencer&siret=82141193100016&effectif=ME&locaux=proprietaire&mobilite=oui&matieres-premieres=oui&tri-dechets=non&dechets=oui&gestion-eau=oui&energie=oui&audit=oui&selection-audit=consommation-energie&selection-audit=eau&selection-audit=performance-energetique&selection-audit=bilan-carbone&selection-audit=certification&selection-audit=matieres-premieres&selection-audit=dechets#questionnaire-resultat',
  'questionnaire/resultat?choix-du-parcours=je-ne-sais-pas-par-ou-commencer&siret=21490007800012&effectif=PE&locaux=proprietaire-et-locataire&mobilite=maximum&matieres-premieres=maximum&tri-dechets=oui&dechets=non&gestion-eau=non&energie=non&audit=non#questionnaire-resultat'
]

// compare the results between the PR branch and the production
queryUrls.forEach((queryUrl, id) => {
  test(`Verify content and elements for query number ${id}`, async ({ page }) => {
    const fullProductionUrl = `${productionUrl}${queryUrl}`
    const fullLocalUrl = `${testUrl}${queryUrl}`

    await page.goto(fullProductionUrl)
    try {
      await page.waitForSelector('.playwright-project-target', { timeout: 3000 })
    } catch (error) {
      // expected when no elements are found
      // it also happen in some other tests cases where there are elements for an unknown reason
    }
    const elementsProduction = await page.$$eval('.playwright-project-target h3', (els) => els.map((el) => el.innerHTML.trim()))

    await page.goto(fullLocalUrl)
    try {
      await page.waitForSelector('.playwright-project-target', { timeout: 3000 })
    } catch (error) {
      // expected when no elements are found
      // it also happen in some other tests cases where there are elements for an unknown reason
    }
    const elementsLocal = await page.$$eval('.playwright-project-target h3', (els) => els.map((el) => el.innerHTML.trim()))
    console.log(elementsProduction.length)
    console.log(elementsLocal.length)

    expect(elementsLocal.length).toBe(elementsProduction.length)
    for (let i = 0; i < elementsProduction.length; i++) {
      expect(elementsProduction[i]).toBe(elementsLocal[i])
    }
  })
})

// check that clicking on a tag or directly loading the page with a tag selected gives the same result