import { HtmlTagDetector } from '@tee/common'

describe('HtmlTagDetector', () => {
  test.each([
    '<script>alert(1)</script>',
    '<img src=x onerror=alert(1)>',
    '"><svg onload=alert(1)>',
    'Projet </title><script>',
    '<!-- comment -->',
    '<?xml version="1.0"?>',
    '<B>gras</B>'
  ])('detects a tag in %s', (text) => {
    expect(HtmlTagDetector.containsHtmlTag(text)).toBe(true)
  })

  test.each([undefined, '', 'Isolation des combles', 'Entreprise < 50 salariés', 'Coût <3 000 €', '&lt;script&gt;', 'a > b'])(
    'does not detect a tag in %s',
    (text) => {
      expect(HtmlTagDetector.containsHtmlTag(text)).toBe(false)
    }
  )
})
