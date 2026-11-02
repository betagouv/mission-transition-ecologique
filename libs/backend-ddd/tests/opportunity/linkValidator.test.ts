import { LinkValidator } from '@tee/common'

describe('LinkValidator', () => {
  test.each([
    'Régularisez votre dossier : https://phishing.example',
    'http://example.com',
    'phishing.example',
    'bit.ly/abc',
    'www.example',
    '192.168.0.1',
    'ftp://files.example',
    String.raw`\\serveur\partage\facture.exe`,
    String.raw`\\serveur`,
    'search-ms:query=facture&crumb=location:\\\\1.2.3.4',
    'ms-msdt:/id PCWDiagnostic',
    'ms-settings:privacy',
    'javascript:alert(1)',
    String.raw`file:C:\Windows\system32`,
    'phishing\u3002example',
    'www\uFF0Eexample'
  ])('detects a link in %s', (text) => {
    expect(LinkValidator.containsLink(text)).toBe(true)
    expect(LinkValidator.validateWithoutLink(text)).toBe(false)
  })

  test.each([
    'Jean-Pierre',
    "O'Neil",
    'St. Martin',
    'M.Dupont',
    'Rénovation du bâtiment B2',
    'Projet 2.0',
    'ex. isolation',
    'Objet : isolation',
    'Data center',
    'Recherche : partenaires'
  ])('accepts %s', (text) => {
    expect(LinkValidator.containsLink(text)).toBe(false)
    expect(LinkValidator.validateWithoutLink(text)).toBe(true)
  })

  test.each([[undefined], [''], ['   ']])('rejects an empty value %s', (text) => {
    expect(LinkValidator.validateWithoutLink(text)).toBe(false)
  })

  test.each([
    ['https://mission-transition-ecologique.beta.gouv.fr/aides-entreprise', true],
    ['http://localhost:4242/projets-entreprise', true],
    ['/', false],
    ['javascript:alert(1)', false],
    ['not an url', false]
  ])('isHttpUrl(%s) is %s', (value, expected) => {
    expect(LinkValidator.isHttpUrl(value)).toBe(expected)
  })

  test.each([
    ['https://mission-transition-ecologique.beta.gouv.fr/aides-entreprise', true],
    ['https://MISSION-TRANSITION-ECOLOGIQUE.beta.gouv.fr', true],
    ['http://localhost:4242/', true],
    ['https://phishing.example/mission-transition-ecologique.beta.gouv.fr', false],
    ['https://mission-transition-ecologique.beta.gouv.fr.phishing.example', false],
    ['/', false]
  ])('hasAllowedHost(%s) is %s', (value, expected) => {
    expect(LinkValidator.hasAllowedHost(value, ['mission-transition-ecologique.beta.gouv.fr', 'localhost:4242'])).toBe(expected)
  })
})
