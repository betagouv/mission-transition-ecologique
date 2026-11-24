import axios from 'axios'
import { chromium } from 'playwright'
import { LogLevel } from '../../../src/common/logger/types'
import { LinkStatus } from '../../../src/common/validators/linkStatus'
import { LinkValidator } from '../../../src/common/validators/linkValidator'

vi.mock('axios', () => ({
  default: { get: vi.fn() }
}))

vi.mock('playwright', () => ({
  chromium: { launch: vi.fn() }
}))

interface FakeResponse {
  status: number
  cfMitigated?: string
}

const fetchResponse = ({ status, cfMitigated }: FakeResponse) => ({
  status,
  headers: { get: (name: string) => (name === 'cf-mitigated' ? (cfMitigated ?? null) : null) }
})

const axiosResponse = ({ status, cfMitigated }: FakeResponse) => ({
  status,
  headers: cfMitigated ? { 'cf-mitigated': cfMitigated } : {}
})

// HEAD, GET then axios GET
const mockResponses = (head: FakeResponse | Error, get: FakeResponse | Error, axiosGet: FakeResponse | Error) => {
  const fetchMock = vi.fn((_url: URL, init: RequestInit) => {
    const response = init.method === 'HEAD' ? head : get
    return response instanceof Error ? Promise.reject(response) : Promise.resolve(fetchResponse(response))
  })
  vi.stubGlobal('fetch', fetchMock)
  vi.mocked(axios.get).mockImplementation(() =>
    axiosGet instanceof Error ? Promise.reject(axiosGet) : Promise.resolve(axiosResponse(axiosGet))
  )
  return fetchMock
}

// Playwright browser whose pages answer with the given response, or fail to navigate
const mockBrowser = (response: FakeResponse | Error) => {
  const handlers: Record<string, () => void> = {}
  const goto = () =>
    response instanceof Error
      ? Promise.reject(response)
      : Promise.resolve({
          status: () => response.status,
          headers: () => (response.cfMitigated ? { 'cf-mitigated': response.cfMitigated } : {})
        })
  const browser = {
    newContext: vi.fn(() => Promise.resolve({ newPage: () => Promise.resolve({ goto }), close: () => Promise.resolve() })),
    close: vi.fn(() => Promise.resolve()),
    on: vi.fn((event: string, handler: () => void) => {
      handlers[event] = handler
    }),
    // simulates a browser crash
    disconnect: () => handlers['disconnected']?.()
  }
  vi.mocked(chromium.launch).mockResolvedValue(browser as never)
  return browser
}

// The validator keeps a static cache: each test uses its own host
let counter = 0
const uniqueLink = (host = 'example') => `https://${host}-${++counter}.fr/page`

describe('LinkValidator.checkLink', () => {
  beforeAll(() => {
    vi.stubEnv('LINK_VALIDATOR_PLAYWRIGHT_ENABLE', 'false')
  })

  afterAll(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns Valid when HEAD succeeds', async () => {
    mockResponses({ status: 200 }, { status: 500 }, { status: 500 })
    expect(await LinkValidator.checkLink(uniqueLink())).toBe(LinkStatus.Valid)
  })

  it('falls back to GET when HEAD fails with a 5xx', async () => {
    mockResponses({ status: 502 }, { status: 200 }, { status: 500 })
    expect(await LinkValidator.checkLink(uniqueLink())).toBe(LinkStatus.Valid)
  })

  it('falls back to GET when HEAD returns a 404', async () => {
    mockResponses({ status: 404 }, { status: 200 }, { status: 500 })
    expect(await LinkValidator.checkLink(uniqueLink())).toBe(LinkStatus.Valid)
  })

  it('returns Broken when GET returns a 404', async () => {
    mockResponses({ status: 404 }, { status: 404 }, { status: 200 })
    expect(await LinkValidator.checkLink(uniqueLink())).toBe(LinkStatus.Broken)
  })

  it('returns Broken on persistent 5xx', async () => {
    mockResponses({ status: 500 }, { status: 500 }, { status: 500 })
    expect(await LinkValidator.checkLink(uniqueLink())).toBe(LinkStatus.Broken)
  })

  it('returns Broken on persistent network errors when playwright is disabled', async () => {
    const error = new Error('socket hang up')
    mockResponses(error, error, error)
    expect(await LinkValidator.checkLink(uniqueLink())).toBe(LinkStatus.Broken)
  })

  it('returns Broken on a 401', async () => {
    mockResponses({ status: 401 }, { status: 401 }, { status: 401 })
    expect(await LinkValidator.checkLink(uniqueLink())).toBe(LinkStatus.Broken)
  })

  it('does not let a 403 on HEAD hide a persistent 5xx on GET', async () => {
    mockResponses({ status: 403 }, { status: 500 }, { status: 500 })
    expect(await LinkValidator.checkLink(uniqueLink())).toBe(LinkStatus.Broken)
  })

  it('returns Unverifiable on a Cloudflare challenge on GET and skips the next requests on the same host', async () => {
    const fetchMock = mockResponses({ status: 403 }, { status: 403, cfMitigated: 'challenge' }, { status: 403 })
    const host = `protected-${++counter}.fr`

    expect(await LinkValidator.checkLink(`https://${host}/a`)).toBe(LinkStatus.Unverifiable)
    expect(fetchMock).toHaveBeenCalledTimes(2)

    expect(await LinkValidator.checkLink(`https://${host}/b`)).toBe(LinkStatus.Unverifiable)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('returns Unverifiable on a Cloudflare challenge on HEAD without skipping the rest of the host', async () => {
    const fetchMock = mockResponses({ status: 403, cfMitigated: 'challenge' }, { status: 200 }, { status: 200 })
    const host = `head-protected-${++counter}.fr`

    expect(await LinkValidator.checkLink(`https://${host}/a`)).toBe(LinkStatus.Unverifiable)
    expect(fetchMock).toHaveBeenCalledTimes(1)

    await LinkValidator.checkLink(`https://${host}/b`)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it.each([403, 429])('returns Unverifiable on persistent %s without Cloudflare when playwright is disabled', async (status) => {
    mockResponses({ status }, { status }, { status })
    expect(await LinkValidator.checkLink(uniqueLink())).toBe(LinkStatus.Unverifiable)
  })

  it('returns Malformed without any request for a local file path', async () => {
    const fetchMock = mockResponses({ status: 200 }, { status: 200 }, { status: 200 })
    expect(await LinkValidator.checkLink('https://file:///Users/betagouv/Downloads/cahier.pdf')).toBe(LinkStatus.Malformed)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})

describe('LinkValidator playwright browser', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('LINK_VALIDATOR_PLAYWRIGHT_ENABLE', 'true')
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('reuses a single browser for several links and closes it once idle', async () => {
    mockResponses({ status: 403 }, { status: 403 }, { status: 403 })
    const browser = mockBrowser({ status: 200 })

    expect(await LinkValidator.checkLink(uniqueLink())).toBe(LinkStatus.Valid)
    expect(await LinkValidator.checkLink(uniqueLink())).toBe(LinkStatus.Valid)

    expect(chromium.launch).toHaveBeenCalledTimes(1)
    expect(browser.newContext).toHaveBeenCalledTimes(2)
    expect(browser.close).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(5000)
    expect(browser.close).toHaveBeenCalledTimes(1)
  })

  it('returns Broken when the browser gets a 404', async () => {
    mockResponses({ status: 403 }, { status: 403 }, { status: 403 })
    mockBrowser({ status: 404 })
    expect(await LinkValidator.checkLink(uniqueLink())).toBe(LinkStatus.Broken)
    await vi.advanceTimersByTimeAsync(5000)
  })

  it.each([401, 403, 500])('returns Broken when the browser also gets a %s without challenge', async (status) => {
    mockResponses({ status: 403 }, { status: 403 }, { status: 403 })
    mockBrowser({ status })
    expect(await LinkValidator.checkLink(uniqueLink())).toBe(LinkStatus.Broken)
    await vi.advanceTimersByTimeAsync(5000)
  })

  it('returns Unverifiable when the browser is rate limited', async () => {
    mockResponses({ status: 429 }, { status: 429 }, { status: 429 })
    mockBrowser({ status: 429 })
    expect(await LinkValidator.checkLink(uniqueLink())).toBe(LinkStatus.Unverifiable)
    await vi.advanceTimersByTimeAsync(5000)
  })

  it('returns Unverifiable when the browser gets a challenge and skips the next requests on the same host', async () => {
    const fetchMock = mockResponses({ status: 403 }, { status: 403 }, { status: 403 })
    const browser = mockBrowser({ status: 403, cfMitigated: 'challenge' })
    const host = `browser-protected-${++counter}.fr`

    expect(await LinkValidator.checkLink(`https://${host}/a`)).toBe(LinkStatus.Unverifiable)
    expect(await LinkValidator.checkLink(`https://${host}/b`)).toBe(LinkStatus.Unverifiable)

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(browser.newContext).toHaveBeenCalledTimes(1)
    await vi.advanceTimersByTimeAsync(5000)
  })

  it('uses the browser after network errors on every request', async () => {
    const error = new Error('socket hang up')
    mockResponses(error, error, error)
    mockBrowser({ status: 200 })
    expect(await LinkValidator.checkLink(uniqueLink())).toBe(LinkStatus.Valid)
    await vi.advanceTimersByTimeAsync(5000)
  })

  it('returns Broken when the browser fails to navigate after network errors', async () => {
    const error = new Error('socket hang up')
    mockResponses(error, error, error)
    mockBrowser(new Error('net::ERR_NAME_NOT_RESOLVED'))
    expect(await LinkValidator.checkLink(uniqueLink())).toBe(LinkStatus.Broken)
    await vi.advanceTimersByTimeAsync(5000)
  })

  it('returns Unverifiable when the browser fails to navigate after a 403', async () => {
    mockResponses({ status: 403 }, { status: 403 }, { status: 403 })
    mockBrowser(new Error('Timeout 20000ms exceeded'))
    expect(await LinkValidator.checkLink(uniqueLink())).toBe(LinkStatus.Unverifiable)
    await vi.advanceTimersByTimeAsync(5000)
  })

  it('returns Unverifiable when the browser cannot be launched', async () => {
    mockResponses({ status: 403 }, { status: 403 }, { status: 403 })
    vi.mocked(chromium.launch).mockRejectedValue(new Error('no browser'))
    expect(await LinkValidator.checkLink(uniqueLink())).toBe(LinkStatus.Unverifiable)
  })

  it('launches a new browser after a crash', async () => {
    mockResponses({ status: 403 }, { status: 403 }, { status: 403 })
    const browser = mockBrowser({ status: 200 })

    expect(await LinkValidator.checkLink(uniqueLink())).toBe(LinkStatus.Valid)
    browser.disconnect()
    expect(await LinkValidator.checkLink(uniqueLink())).toBe(LinkStatus.Valid)

    expect(chromium.launch).toHaveBeenCalledTimes(2)
    await vi.advanceTimersByTimeAsync(5000)
  })
})

describe('LinkValidator.isMalformed', () => {
  it.each([
    ['https://file:///Users/betagouv/Downloads/cahier.pdf', true],
    ['file:///Users/betagouv/cahier.pdf', true],
    ['http://localhost:3000', true],
    ['not a url', true],
    ['https://www.example.fr/page', false],
    ['https://192.168.1.1:8080', false]
  ])('%s → %s', (link, expected) => {
    expect(LinkValidator.isMalformed(link)).toBe(expected)
  })
})

describe('LinkValidator.logLinkStatus', () => {
  const logger = { log: vi.fn(), logLink: vi.fn(), write: vi.fn() }
  const context = { logger, brokenLevel: LogLevel.Major, field: 'étape 1', id: 'mon-dispositif', rowId: 42 }

  beforeEach(() => {
    logger.logLink.mockClear()
  })

  it('does not log a valid link', () => {
    LinkValidator.logLinkStatus({ link: 'https://ok.fr', status: LinkStatus.Valid }, context)
    expect(logger.logLink).not.toHaveBeenCalled()
  })

  it.each([
    [LinkStatus.Broken, LogLevel.Major],
    [LinkStatus.Malformed, LogLevel.Critic],
    [LinkStatus.Unverifiable, LogLevel.Info]
  ])('logs a %s link with level %s', (status, level) => {
    LinkValidator.logLinkStatus({ link: 'https://site.fr', status }, context)
    expect(logger.logLink).toHaveBeenCalledWith(level, { url: 'https://site.fr', status, field: 'étape 1' }, 'mon-dispositif', 42)
  })
})
