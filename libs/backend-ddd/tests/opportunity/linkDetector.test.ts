import { LinkDetector } from '@tee/common'

describe('LinkDetector', () => {
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
    'www\uFF0Eexample',
    'data:text/html,<script>',
    'phishing\u200B.example',
    'phishing\u00AD.example',
    'phishin\u0301g.example'
  ])('detects a link in %s', (text) => {
    expect(LinkDetector.containsLink(text)).toBe(true)
    expect(LinkDetector.validateWithoutLink(text)).toBe(false)
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
    'Recherche : partenaires',
    'Big data: analyse'
  ])('accepts %s', (text) => {
    expect(LinkDetector.containsLink(text)).toBe(false)
    expect(LinkDetector.validateWithoutLink(text)).toBe(true)
  })

  test.each([[undefined], [''], ['   ']])('rejects an empty value %s', (text) => {
    expect(LinkDetector.validateWithoutLink(text)).toBe(false)
  })

  test.each([
    ['https://mission-transition-ecologique.beta.gouv.fr/aides-entreprise', true],
    ['http://localhost:4242/projets-entreprise', true],
    ['/', false],
    ['javascript:alert(1)', false],
    ['not an url', false]
  ])('isHttpUrl(%s) is %s', (value, expected) => {
    expect(LinkDetector.isHttpUrl(value)).toBe(expected)
  })

  test.each([
    ['https://mission-transition-ecologique.beta.gouv.fr/aides-entreprise', true],
    ['https://MISSION-TRANSITION-ECOLOGIQUE.beta.gouv.fr', true],
    ['http://localhost:4242/', true],
    ['https://phishing.example/mission-transition-ecologique.beta.gouv.fr', false],
    ['https://mission-transition-ecologique.beta.gouv.fr.phishing.example', false],
    ['/', false]
  ])('hasAllowedHost(%s) is %s', (value, expected) => {
    expect(LinkDetector.hasAllowedHost(value, ['mission-transition-ecologique.beta.gouv.fr', 'localhost:4242'])).toBe(expected)
  })

  test.each([['a'], ['a.'], ['a1-'], ['https:']])('scans a long text quickly (%s repeated)', (pattern) => {
    const text = pattern.repeat(LinkDetector.maxTextLength / pattern.length)
    const start = performance.now()

    LinkDetector.containsLink(text)

    expect(performance.now() - start).toBeLessThan(50)
  })

  test('treats a text longer than the limit as containing a link', () => {
    expect(LinkDetector.containsLink('a'.repeat(LinkDetector.maxTextLength + 1))).toBe(true)
  })
})
