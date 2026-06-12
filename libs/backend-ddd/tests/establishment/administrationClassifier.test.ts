import { AdministrationClassifier } from '../../src/establishment/infrastructure/json/administrationClassifier'

// Deterministic reference lists so the test does not depend on the real JSON data
vi.mock('@tee/data/static', () => ({
  administrationNaturesJuridiques: { '7210': 'Commune et commune nouvelle' },
  administrationWhitelist: { WHITELISTED: 'Whitelisted entity' },
  administrationBlacklist: { BLACKLISTED: 'Blacklisted entity' }
}))

const ADMIN_CATEGORY = '7210'
const NON_ADMIN_CATEGORY = '5710'
const NEUTRAL_SIREN = '000000000'

describe('AdministrationClassifier', () => {
  const classifier = new AdministrationClassifier()

  test('returns true when the legal nature belongs to the administration list', () => {
    expect(classifier.isAdministration(ADMIN_CATEGORY, NEUTRAL_SIREN)).toBe(true)
  })

  test('returns false when the legal nature is not in the administration list', () => {
    expect(classifier.isAdministration(NON_ADMIN_CATEGORY, NEUTRAL_SIREN)).toBe(false)
  })

  test('returns false when the legal nature is missing', () => {
    expect(classifier.isAdministration('', NEUTRAL_SIREN)).toBe(false)
  })

  test('returns false when the SIREN is blacklisted, even with an administration legal nature', () => {
    expect(classifier.isAdministration(ADMIN_CATEGORY, 'BLACKLISTED')).toBe(false)
  })

  test('returns false when the unit is ceased (etatAdministratif "C")', () => {
    expect(classifier.isAdministration(ADMIN_CATEGORY, NEUTRAL_SIREN, 'C')).toBe(false)
  })

  test('returns true when the unit is active (etatAdministratif "A")', () => {
    expect(classifier.isAdministration(ADMIN_CATEGORY, NEUTRAL_SIREN, 'A')).toBe(true)
  })

  test('returns true when the SIREN is whitelisted, even with a non-administration legal nature', () => {
    expect(classifier.isAdministration(NON_ADMIN_CATEGORY, 'WHITELISTED')).toBe(true)
  })

  test('blacklist takes precedence over whitelist', () => {
    expect(classifier.isAdministration(ADMIN_CATEGORY, 'BLACKLISTED')).toBe(false)
  })

  test('ceased unit takes precedence over whitelist', () => {
    expect(classifier.isAdministration(NON_ADMIN_CATEGORY, 'WHITELISTED', 'C')).toBe(false)
  })
})
