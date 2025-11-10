import { LinkValidator } from '../../../../src/common/validators/linkValidator'

describe('LinkValidator', () => {
  const foundLinks = LinkValidator.foundLinks

  const testCases = [
    {
      description: 'finds a single HTTP or HTTPS URL',
      text: ['Find http://example.com', 'Find https://example.com'],
      expected: [['http://example.com'], ['https://example.com']]
    },
    {
      description: 'finds multiple URLs',
      text: ['Check http://example.com and https://example.fr'],
      expected: [['http://example.com', 'https://example.fr']]
    },
    {
      description: 'returns empty array for no URLs',
      text: ['No links here', ''],
      expected: [[], []]
    },
    {
      description: 'finds URLs with paths, query parameters, ports, or fragments',
      text: ['Visit https://example.com/path?param=value', 'Local server at http://localhost:3000', 'See https://example.com/page#section'],
      expected: [['https://example.com/path?param=value'], ['http://localhost:3000'], ['https://example.com/page#section']]
    },
    {
      description: 'ignores trailing punctuation or malformed URLs',
      text: ['Visit https://example.com.', 'htp://example.com or ftp://example.com'],
      expected: [['https://example.com'], []]
    },
    {
      description: 'handles multiple lines with URLs',
      text: `Line 1: https://example.com\n\nLine 2: http://another-site.org`,
      expected: [['https://example.com', 'http://another-site.org']]
    },
    {
      description: 'handles multiple lines with URLs and code tokens (tabs)',
      text: `Line 1: https://example.com\n\n    Line 2: http://another-site.org`,
      expected: [['https://example.com']]
    },
    {
      description: 'finds URLs in parentheses, brackets, or markdown',
      text: [
        'Check (https://example.com) and [http://test.org]',
        '[https://bar.org]',
        'here you can find [our site](https://example.com).'
      ],
      expected: [['https://example.com', 'http://test.org]'], ['https://bar.org]'], ['https://example.com']]
    },
    {
      description: 'test markdown',
      text: ['here you can find [our site](https://example.com).'],
      expected: [['https://example.com']]
    },
    {
      description: 'finds IP-based URLs or encoded characters',
      text: ['Connect to https://192.168.1.1:8080', 'Search at https://example.com?q=hello%20world'],
      expected: [['https://192.168.1.1:8080'], ['https://example.com?q=hello%20world']]
    }
  ]

  testCases.forEach(({ description, text, expected }) => {
    it(description, () => {
      if (Array.isArray(text)) {
        text.forEach((t, i) => {
          expect(foundLinks(t)).toEqual(expected[i])
        })
      } else {
        expect(foundLinks(text)).toEqual(expected[0])
      }
    })
  })
})
