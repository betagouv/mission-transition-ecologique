import { NameValidator } from '@tee/common'

describe('NameValidator', () => {
  test.each([
    'Jean',
    'Jean-Pierre',
    'Dupont - Martin',
    'Jean\u2010Pierre',
    'Jean\u2011Pierre',
    'Jean\u2013Pierre',
    "O'Neil",
    'D’Artagnan',
    'Éloïse',
    'St. Martin',
    'M.Dupont',
    'de la Fontaine',
    'Zoë',
    'Müller',
    '  Jean  '
  ])('accepts %s', (name) => {
    expect(NameValidator.validate(name)).toBe(true)
  })

  test.each([
    undefined,
    '',
    '   ',
    '-Jean',
    'Jean2',
    'https://phishing.example',
    'phishing.example',
    String.raw`\\serveur\partage`,
    'search-ms:query',
    'jean@phishing.example',
    'Jean <b>',
    'a'.repeat(101)
  ])('rejects %s', (name) => {
    expect(NameValidator.validate(name)).toBe(false)
  })
})
