import { expect, test } from '@nuxt/test-utils/playwright'

// Checks of POST /api/opportunities that stop before any opportunity is created (no Brevo or hub call)
const url = '/api/opportunities'

const opportunity = (override: Record<string, unknown> = {}) => ({
  type: 'program',
  id: 'diagnostic-rse',
  firstName: 'Jean',
  lastName: 'Dupont',
  email: 'jean.dupont@exemple.fr',
  phoneNumber: '0605040302',
  companySiret: '83014132100042',
  message: 'Bonjour',
  linkToCatalog: 'http://localhost:4242/aides-entreprise/diagnostic-rse',
  ...override
})

test.describe('POST /api/opportunities', () => {
  test('rejects a request that is not sent as JSON (415)', async ({ request }) => {
    const response = await request.post(url, {
      headers: { 'Content-Type': 'text/plain' },
      data: JSON.stringify({ opportunity: opportunity(), optIn: true })
    })

    expect(response.status()).toBe(415)
  })

  test('rejects a body larger than 100 KB (413)', async ({ request }) => {
    const response = await request.post(url, {
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({ opportunity: opportunity({ message: 'a'.repeat(150_000) }), optIn: true })
    })

    expect(response.status()).toBe(413)
  })

  test('rejects a link in the first name (422)', async ({ request }) => {
    const response = await request.post(url, {
      data: { opportunity: opportunity({ firstName: 'https://phishing.example' }), optIn: true }
    })

    expect(response.status()).toBe(422)
  })

  test('rejects a catalog link outside of the allowed hosts (422)', async ({ request }) => {
    const response = await request.post(url, {
      data: { opportunity: opportunity({ linkToCatalog: 'https://phishing.example/x' }), optIn: true }
    })

    expect(response.status()).toBe(422)
    expect(JSON.stringify(await response.json())).toContain('linkToCatalog')
  })

  test('accepts a catalog link of a partner host, then requires the opt-in (422)', async ({ request }) => {
    const response = await request.post(url, {
      data: {
        opportunity: opportunity({
          linkToCatalog: 'https://rec-agir.direct.horsprod.ademe-scw.fr/entreprises/aides-financieres/catalogue/x'
        }),
        optIn: false
      }
    })

    expect(response.status()).toBe(422)
    expect(JSON.stringify(await response.json())).toContain('opt-in')
  })

  test('rejects an invalid API key before any other check (401)', async ({ request }) => {
    const response = await request.post(url, {
      headers: { Authorization: 'Bearer wrong-key', 'Content-Type': 'text/plain' },
      data: JSON.stringify({ opportunity: opportunity(), optIn: true })
    })

    expect(response.status()).toBe(401)
    expect(response.headers()['www-authenticate']).toBe('Bearer')
  })

  test('rejects a malformed Authorization header (401)', async ({ request }) => {
    const response = await request.post(url, {
      headers: { Authorization: 'e2e-api-key' },
      data: { opportunity: opportunity(), optIn: true }
    })

    expect(response.status()).toBe(401)
  })

  // The key is set in the webServer env of playwright.config.ts
  test('accepts a catalog link of any host with a valid API key, then requires the opt-in (422)', async ({ request }) => {
    const response = await request.post(url, {
      headers: { Authorization: 'Bearer e2e-api-key' },
      data: { opportunity: opportunity({ linkToCatalog: 'https://partner.example/catalogue/x' }), optIn: false }
    })

    expect(response.status()).toBe(422)
    expect(JSON.stringify(await response.json())).toContain('opt-in')
  })

  test('keeps the body validation with a valid API key (422)', async ({ request }) => {
    const response = await request.post(url, {
      headers: { Authorization: 'Bearer e2e-api-key' },
      data: { opportunity: opportunity({ firstName: 'https://phishing.example' }), optIn: true }
    })

    expect(response.status()).toBe(422)
  })
})
