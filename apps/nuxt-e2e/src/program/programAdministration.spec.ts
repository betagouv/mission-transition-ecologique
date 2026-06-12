import { expect, test } from '@nuxt/test-utils/playwright'
import { timeOut } from '../config'

/**
 * End-to-end tests for the "ouvert aux administrations publiques" gating.
 *
 * Data setup (libs/data/static/programs_tests.json): only "Formation ADEME" is flagged
 * openToPublicAdministration. It has no NAF/region/employee restriction, so it is eligible
 * for any establishment.
 *
 * The gating is temporarily scoped to NAF section Q only. SIRET 26120014100016
 * (a CENTRE HOSPITALIER) is a public administration (isAdministration = true) whose
 * NAF code 86.10Z belongs to section Q, so the gating applies.
 */

const cardsSelector = '.fr-card--program .fr-card__title a'

// Common questionnaire answers; objectives do not matter for "Formation ADEME" (always eligible)
const questionnaireParams =
  'locaux=proprietaire&mobilite=oui&matieres-premieres=oui&tri-dechets=non&dechets=oui&gestion-eau=oui&energie=non&audit=non'

test('a NAF-Q administration only sees programs open to public administrations', async ({ page, goto }) => {
  const url = `questionnaire/resultat?siret=26120014100016&effectif=ME&${questionnaireParams}#questionnaire-resultat`
  await goto(url, { waitUntil: 'hydration' })

  const cards = page.locator(cardsSelector)

  // The administration gating keeps only the single program open to administrations
  await expect(cards).toHaveCount(1, { timeout: timeOut })
  await expect(cards.first()).toHaveText('Formation ADEME')
})

test('a regular company is not affected by the administration gating', async ({ page, goto }) => {
  const url = `questionnaire/resultat?siret=83014132100042&effectif=TPE&${questionnaireParams}#questionnaire-resultat`
  await goto(url, { waitUntil: 'hydration' })

  const cards = page.locator(cardsSelector)

  // Gating is off for non-administrations: a program NOT open to administrations is still shown
  await expect(cards.filter({ hasText: 'Communauté du Coq Vert' })).toHaveCount(1, { timeout: timeOut })
  await expect(cards.filter({ hasText: 'Formation ADEME' })).toHaveCount(1)
})
