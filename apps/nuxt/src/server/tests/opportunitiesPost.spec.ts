// @vitest-environment node
import { createServer, Server } from 'node:http'
import { AddressInfo } from 'node:net'
import * as h3 from 'h3'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

const { createOpportunity } = vi.hoisted(() => ({ createOpportunity: vi.fn() }))

// The route only needs the service and the monitoring of the backend
vi.mock('@tee/backend-ddd', () => ({
  Monitor: { warning: vi.fn(), error: vi.fn() },
  OpportunityService: class {
    createOpportunity = createOpportunity
  },
  OptInRequiredError: class extends Error {},
  ServiceNotFoundError: class extends Error {}
}))

// Nuxt auto-imports used by the route
vi.stubGlobal('defineRouteMeta', () => undefined)
vi.stubGlobal('createError', h3.createError)
vi.stubGlobal('readValidatedBody', h3.readValidatedBody)
vi.stubGlobal('useRuntimeConfig', () => ({ public: { siteUrl: undefined } }))

const opportunity = {
  type: 'program',
  id: 'diagnostic-rse',
  firstName: 'Jean',
  lastName: 'Dupont',
  email: 'jean.dupont@exemple.fr',
  phoneNumber: '0605040302',
  companySiret: '83014132100042',
  message: 'Bonjour',
  linkToCatalog: 'https://agir.example/catalogue/diagnostic-rse'
}

// A real Node server, as Nitro: the route reads the raw body before validating it
let server: Server
let url: string

beforeAll(async () => {
  vi.stubEnv('OPPORTUNITY_API_KEYS', 'agir:agir-key')
  const handler = (await import('../api/opportunities/index.post')).default
  server = createServer(h3.toNodeListener(h3.createApp().use('/api/opportunities', handler)))
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/opportunities`
})

afterAll(() => {
  server.close()
  vi.unstubAllEnvs()
})

afterEach(() => {
  createOpportunity.mockReset()
})

const post = (headers: Record<string, string>, body: unknown) =>
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body)
  })

describe('POST /api/opportunities partner', () => {
  it('passes the partner of a valid API key to createOpportunity, and ignores a partner sent in the body', async () => {
    createOpportunity.mockResolvedValue({ isErr: false, value: { id: '1' } })

    const response = await post({ Authorization: 'Bearer agir-key' }, { opportunity: { ...opportunity, partner: 'other' }, optIn: true })

    expect(response.status).toBe(200)
    expect(createOpportunity).toHaveBeenCalledOnce()
    const [sentOpportunity, optIn, partner] = createOpportunity.mock.calls[0] as [object, boolean, string | undefined]
    expect(sentOpportunity).not.toHaveProperty('partner')
    expect(optIn).toBe(true)
    expect(partner).toBe('agir')
  })

  it('passes no partner without Authorization header, even with a partner in the body', async () => {
    createOpportunity.mockResolvedValue({ isErr: false, value: { id: '1' } })

    const response = await post(
      {},
      {
        opportunity: {
          ...opportunity,
          linkToCatalog: 'https://mission-transition-ecologique.beta.gouv.fr/aides-entreprise/diagnostic-rse',
          partner: 'agir'
        },
        optIn: true
      }
    )

    expect(response.status).toBe(200)
    expect(createOpportunity.mock.calls[0]?.[2]).toBeUndefined()
  })
})
