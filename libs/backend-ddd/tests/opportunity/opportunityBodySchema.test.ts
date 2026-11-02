import { opportunityBodySchema, ThemeId } from '@tee/common'
import { fakeOpportunity } from './opportunity.fixtures'

const parseWithTheme = (theme: unknown) => {
  return opportunityBodySchema.safeParse({
    opportunity: { ...fakeOpportunity(), theme },
    optIn: true
  })
}

describe('opportunityBodySchema theme validation', () => {
  test.each(Object.values(ThemeId))('keeps the theme id %s', (themeId) => {
    const result = parseWithTheme(themeId)

    expect(result.success).toBe(true)
    expect(result.data?.opportunity.theme).toBe(themeId)
  })

  test.each([['⚡️ énergie'], ['unknown-theme'], [42], [null]])('accepts the opportunity without theme when theme is %s', (theme) => {
    const result = parseWithTheme(theme)

    expect(result.success).toBe(true)
    expect(result.data?.opportunity.theme).toBeUndefined()
  })

  test('accepts an opportunity without theme', () => {
    const result = parseWithTheme(undefined)

    expect(result.success).toBe(true)
    expect(result.data?.opportunity.theme).toBeUndefined()
  })
})

describe('opportunityBodySchema anti-phishing validation', () => {
  const parse = (override: Record<string, unknown>) => {
    return opportunityBodySchema.safeParse({
      opportunity: { ...fakeOpportunity(), ...override },
      optIn: true
    })
  }

  test('accepts a valid opportunity', () => {
    expect(parse({}).success).toBe(true)
  })

  test('rejects the phishing payload seen in production', () => {
    const result = parse({
      type: 'customProject',
      id: 'Régularisez votre dossier : https://phishing.example',
      titleMessage: 'Régularisez votre dossier : https://phishing.example',
      firstName: 'Support',
      lastName: 'Officiel',
      phoneNumber: '0000000000',
      linkToPage: '/',
      message: 'Merci de confirmer vos identifiants sous 24h : https://phishing.example'
    })

    expect(result.success).toBe(false)
    const fields = result.error?.issues.map((issue) => issue.path.at(-1))
    expect(fields).toEqual(expect.arrayContaining(['titleMessage', 'linkToPage']))
  })

  test.each([
    ['firstName', 'https://phishing.example'],
    ['lastName', 'phishing.example'],
    ['firstName', ''],
    ['titleMessage', 'www.phishing.example'],
    ['phoneNumber', 'https://phishing.example'],
    ['phoneNumber', '06'],
    ['email', 'not-an-email'],
    ['linkToPage', '/'],
    ['linkToCatalog', 'javascript:alert(1)'],
    ['message', 'a'.repeat(10001)]
  ])('rejects %s = %s', (field, value) => {
    expect(parse({ [field]: value }).success).toBe(false)
  })

  test.each([[''], [undefined]])('rejects a missing catalog link (%s)', (linkToCatalog) => {
    expect(parse({ linkToCatalog }).success).toBe(false)
  })

  test.each([['titleMessage'], ['firstName'], ['lastName'], ['phoneNumber'], ['linkToPage'], ['linkToCatalog']])(
    'rejects a very long %s quickly (ReDoS)',
    (field) => {
      const start = performance.now()

      expect(parse({ [field]: 'a'.repeat(200000) }).success).toBe(false)
      expect(performance.now() - start).toBeLessThan(200)
    }
  )

  test('stores the name with simple spaces', () => {
    expect(parse({ firstName: 'Jean\u00A0Pierre' }).data?.opportunity.firstName).toBe('Jean Pierre')
  })

  test('accepts a message containing a link', () => {
    expect(parse({ message: 'Notre site : https://www.entreprise.fr' }).success).toBe(true)
  })

  test('accepts a phone number with spaces and international prefix', () => {
    expect(parse({ phoneNumber: '+33 6 05 04 03 02' }).success).toBe(true)
  })
})
