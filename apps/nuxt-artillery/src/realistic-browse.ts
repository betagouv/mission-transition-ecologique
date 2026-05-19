import { Page } from 'playwright'
import { TestType } from 'playwright/types/test'
import { Homepage, Programs, Projects } from './pages'

/**
 * 50 real SIRET profiles of Isère (38) companies, sourced from recherche-entreprises.api.gouv.fr.
 * Effectif distribution reflects the French company landscape (heavy on MICRO/TPE).
 */
const SIRET_PROFILES = [
  // MICRO (0-9 employees) — 15 profiles
  { siret: '88016215100182', effectif: 'MICRO' },
  { siret: '88427656900495', effectif: 'MICRO' },
  { siret: '89847293100440', effectif: 'MICRO' },
  { siret: '47756787900507', effectif: 'MICRO' },
  { siret: '44121739500165', effectif: 'MICRO' },
  { siret: '83421785300219', effectif: 'MICRO' },
  { siret: '40728027000098', effectif: 'MICRO' },
  { siret: '82374272100033', effectif: 'MICRO' },
  { siret: '90816586300014', effectif: 'MICRO' },
  { siret: '81273857300011', effectif: 'MICRO' },
  { siret: '95173232000019', effectif: 'MICRO' },
  { siret: '34147484900070', effectif: 'MICRO' },
  { siret: '79492287200013', effectif: 'MICRO' },
  { siret: '44403638800056', effectif: 'MICRO' },
  { siret: '79179526300015', effectif: 'MICRO' },

  // TPE (10-19 employees) — 13 profiles
  { siret: '49007233700143', effectif: 'TPE' },
  { siret: '32468419000030', effectif: 'TPE' },
  { siret: '52390527100038', effectif: 'TPE' },
  { siret: '77567618203737', effectif: 'TPE' },
  { siret: '77569207200553', effectif: 'TPE' },
  { siret: '44380122000205', effectif: 'TPE' },
  { siret: '82785663400072', effectif: 'TPE' },
  { siret: '78989596800111', effectif: 'TPE' },
  { siret: '88090763900046', effectif: 'TPE' },
  { siret: '39193714100078', effectif: 'TPE' },
  { siret: '90251855400115', effectif: 'TPE' },
  { siret: '55208218200148', effectif: 'TPE' },
  { siret: '34427945000094', effectif: 'TPE' },

  // PE (20-249 employees) — 11 profiles
  { siret: '52175896100010', effectif: 'PE' },
  { siret: '43979381101744', effectif: 'PE' },
  { siret: '30431845400275', effectif: 'PE' },
  { siret: '39929299400965', effectif: 'PE' },
  { siret: '54203432703861', effectif: 'PE' },
  { siret: '37804750000319', effectif: 'PE' },
  { siret: '77567565503352', effectif: 'PE' },
  { siret: '77568202400333', effectif: 'PE' },
  { siret: '31814846700448', effectif: 'PE' },
  { siret: '82115527200593', effectif: 'PE' },
  { siret: '50201056400594', effectif: 'PE' },

  // ME (250-499 employees) — 6 profiles
  { siret: '59203393002464', effectif: 'ME' },
  { siret: '30536216201811', effectif: 'ME' },
  { siret: '35286063901577', effectif: 'ME' },
  { siret: '51030295300896', effectif: 'ME' },
  { siret: '39070389000967', effectif: 'ME' },
  { siret: '37924316501012', effectif: 'ME' },

  // ETI (500-4999 employees) — 3 profiles
  { siret: '31228590116372', effectif: 'ETI' },
  { siret: '42322891502641', effectif: 'ETI' },
  { siret: '30207716900118', effectif: 'ETI' },

  // GE (5000+ employees) — 2 profiles
  { siret: '57210217613840', effectif: 'GE' },
  { siret: '47718101001222', effectif: 'GE' }
]

/**
 * Program slugs used as landing pages for SIRET-based users.
 * These correspond to existing /aides-entreprise/[slug] routes.
 */
const PROGRAM_SLUGS = [
  'accelerateur-decarbonation',
  'cap-decarbonation',
  'cap-transition-ecologique',
  'diagnostic-transition-ecologique',
  'etude-solaire-thermique',
  'investissement-recharge-vehicules-electriques',
  'mission-conseil-rse',
  'pret-vert-ademe',
  'smart-pv',
  'visite-energie'
]

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

/** Returns a random integer between min and max (inclusive) */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/** Creates Programs and Projects configured for realistic browsing (random subset + think time) */
function createPages(page: Page, step: TestType<any, any>['step'], maxPrograms: number, maxProjects: number) {
  return {
    homepage: new Homepage(page, step),
    programs: new Programs(page, step, true, maxPrograms, { min: 5000, max: 15000 }),
    projects: new Projects(page, step, true, maxProjects, { min: 4000, max: 10000 })
  }
}

/** Navigates to a listing section, waits while user scans the list, then visits pages */
async function navigateThenVisit(
  navigate: () => Promise<void>,
  visit: () => Promise<void>,
  page: Page,
  scanWait: [number, number]
): Promise<void> {
  await navigate()
  await page.waitForTimeout(randomInt(scanWait[0], scanWait[1]))
  await visit()
}

/**
 * Standard browsing scenario: homepage → programs list → a few random program pages → projects list → a few random project pages.
 * browse-pages.ts is unaffected: it constructs Programs/Projects without maxPages/thinkTime, visiting all pages with no pauses.
 */
async function browseStandard(
  page: Page,
  _context: { vars: { target: string } },
  _events: unknown,
  test: TestType<any, any>
): Promise<void> {
  try {
    const { step } = test
    const { homepage, programs, projects } = createPages(page, step, randomInt(2, 4), randomInt(1, 3))

    await homepage.navigate()
    await page.waitForTimeout(randomInt(3000, 7000))

    await navigateThenVisit(
      () => programs.navigate(),
      () => programs.visitProgramPages(),
      page,
      [4000, 9000]
    )
    await navigateThenVisit(
      () => projects.navigate(),
      () => projects.visitProjectPages(),
      page,
      [3000, 7000]
    )
  } catch (error) {
    console.error('Error during standard navigation:', error)
  }
}

/**
 * SIRET-based landing scenario: user arrives directly on a program page with siret+effectif
 * params (simulating a shared link with company context), reads it, then browses a few more pages.
 */
async function browseWithSiret(
  page: Page,
  _context: { vars: { target: string } },
  _events: unknown,
  test: TestType<any, any>
): Promise<void> {
  try {
    const { step } = test
    const profile = pickRandom(SIRET_PROFILES)
    const slug = pickRandom(PROGRAM_SLUGS)
    const params = new URLSearchParams({ siret: profile.siret, effectif: profile.effectif })
    const landingUrl = `/aides-entreprise/${slug}?${params.toString()}`
    const { programs, projects } = createPages(page, step, randomInt(1, 3), randomInt(1, 2))

    await step(`SIRET landing - /aides-entreprise/${slug}`, async () => {
      await page.goto(landingUrl)
      console.log(`SIRET landing: ${landingUrl}`)
      await page.waitForLoadState('networkidle')
    })
    await page.waitForTimeout(randomInt(8000, 20000))

    await navigateThenVisit(
      () => programs.navigate(),
      () => programs.visitProgramPages(),
      page,
      [4000, 9000]
    )
    await navigateThenVisit(
      () => projects.navigate(),
      () => projects.visitProjectPages(),
      page,
      [3000, 7000]
    )
  } catch (error) {
    console.error('Error during SIRET-based navigation:', error)
  }
}

export { browseStandard, browseWithSiret }
