import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import { LinkStatus } from '../../../src/common/validators/linkStatus'
import { LinkValidatorCache } from '../../../src/common/validators/linkValidatorCache'

const DAY = 24 * 60 * 60 * 1000
const START = new Date('2026-11-23T03:00:00Z').getTime()

describe('LinkValidatorCache persistence', () => {
  let dir: string
  let filePath: string

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'link-cache-'))
    filePath = path.join(dir, 'cache.json')
  })

  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true })
  })

  const runAt = (time: number, ttlDays = 7) => new LinkValidatorCache(filePath, ttlDays, () => time)

  const persistedLinks = () => Object.keys(JSON.parse(fs.readFileSync(filePath, 'utf8')).validLinks)

  it('does not touch the disk without a file path', () => {
    const cache = new LinkValidatorCache(undefined, 7)
    cache.set('https://ok.fr', LinkStatus.Valid)
    cache.save()
    expect(fs.existsSync(filePath)).toBe(false)
  })

  it('persists only valid links', () => {
    const cache = runAt(START)
    cache.set('https://ok.fr', LinkStatus.Valid)
    cache.set('https://ko.fr', LinkStatus.Broken)
    cache.set('https://cf.fr', LinkStatus.Unverifiable)
    cache.set('https://file', LinkStatus.Malformed)
    cache.save()

    expect(persistedLinks()).toEqual(['https://ok.fr'])
  })

  it('trusts a valid link from a previous run within half of the TTL', () => {
    const first = runAt(START)
    first.set('https://ok.fr', LinkStatus.Valid)
    first.save()

    const second = runAt(START + 3 * DAY)
    expect(second.get('https://ok.fr')).toBe(LinkStatus.Valid)
    expect(second.get('https://ko.fr')).toBeUndefined()
  })

  it('checks a valid link again once the TTL is over', () => {
    const first = runAt(START)
    first.set('https://ok.fr', LinkStatus.Valid)
    first.save()

    const second = runAt(START + 7 * DAY)
    expect(second.get('https://ok.fr')).toBeUndefined()
    second.set('https://autre.fr', LinkStatus.Valid)
    second.save()
    expect(persistedLinks()).toEqual(['https://autre.fr'])
  })

  it('forgets a persisted link that is now broken', () => {
    const first = runAt(START)
    first.set('https://ok.fr', LinkStatus.Valid)
    first.save()

    const second = runAt(START + 7 * DAY)
    second.set('https://ok.fr', LinkStatus.Broken)
    second.save()

    expect(persistedLinks()).toEqual([])
  })

  it('ignores persisted links when the TTL is 0', () => {
    const first = runAt(START)
    first.set('https://ok.fr', LinkStatus.Valid)
    first.save()

    const second = runAt(START + DAY, 0)
    expect(second.get('https://ok.fr')).toBeUndefined()
  })

  it('does not rewrite the file when no link was checked, even with a TTL of 0', () => {
    const first = runAt(START)
    first.set('https://ok.fr', LinkStatus.Valid)
    first.save()

    runAt(START + DAY, 0).save()
    expect(persistedLinks()).toEqual(['https://ok.fr'])
  })

  it('keeps the links not checked by a process with a TTL of 0', () => {
    const first = runAt(START)
    first.set('https://ok.fr', LinkStatus.Valid)
    first.save()

    const refresh = runAt(START + DAY, 0)
    refresh.set('https://autre.fr', LinkStatus.Valid)
    refresh.save()
    expect(persistedLinks()).toEqual(['https://autre.fr', 'https://ok.fr'])
  })

  it('merges the links checked by processes sharing the file', () => {
    const programs = runAt(START)
    const operators = runAt(START)
    programs.set('https://programme.fr', LinkStatus.Valid)
    operators.set('https://operateur.fr', LinkStatus.Valid)

    programs.save()
    operators.save()

    expect(persistedLinks()).toEqual(['https://operateur.fr', 'https://programme.fr'])
  })

  it('leaves no temporary file behind', () => {
    const cache = runAt(START)
    cache.set('https://ok.fr', LinkStatus.Valid)
    cache.save()
    expect(fs.readdirSync(dir)).toEqual(['cache.json'])
  })

  it('ignores malformed entries of the cache file', () => {
    fs.writeFileSync(
      filePath,
      JSON.stringify({
        version: 1,
        validLinks: { 'https://ok.fr': new Date(START).toISOString(), 'https://ko.fr': 42, 'https://nan.fr': 'hier' }
      })
    )
    const cache = runAt(START + DAY)
    expect(cache.get('https://ok.fr')).toBe(LinkStatus.Valid)
    expect(cache.get('https://ko.fr')).toBeUndefined()
    expect(cache.get('https://nan.fr')).toBeUndefined()
  })

  it('ignores a cache file without a links object', () => {
    fs.writeFileSync(filePath, JSON.stringify({ version: 1, validLinks: null }))
    expect(runAt(START).get('https://ok.fr')).toBeUndefined()
  })

  it('ignores an unreadable cache file', () => {
    fs.writeFileSync(filePath, 'not json')
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)

    expect(runAt(START).get('https://ok.fr')).toBeUndefined()
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })
})

describe('LinkValidatorCache.parseTtlDays', () => {
  it.each([
    [undefined, 3],
    ['', 3],
    ['  ', 3],
    ['abc', 3],
    ['-1', 3],
    ['0', 0],
    ['7', 7]
  ])('%j → %s', (value, expected) => {
    expect(LinkValidatorCache.parseTtlDays(value)).toBe(expected)
  })
})

describe('LinkValidatorCache.fromEnv', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  it('saves the cache on exit when a file is configured', () => {
    const once = vi.spyOn(process, 'once').mockImplementation(() => process)
    vi.stubEnv('LINK_VALIDATOR_CACHE_FILE', path.join(os.tmpdir(), 'link-cache-from-env.json'))
    vi.stubEnv('LINK_VALIDATOR_CACHE_TTL_DAYS', '')

    const cache = LinkValidatorCache.fromEnv()
    const save = vi.spyOn(cache, 'save').mockImplementation(() => undefined)

    expect(once).toHaveBeenCalledWith('exit', expect.any(Function))
    ;(once.mock.calls[0][1] as () => void)()
    expect(save).toHaveBeenCalledTimes(1)
  })

  it('does not register an exit handler without a file', () => {
    const once = vi.spyOn(process, 'once').mockImplementation(() => process)
    vi.stubEnv('LINK_VALIDATOR_CACHE_FILE', '')

    LinkValidatorCache.fromEnv()
    expect(once).not.toHaveBeenCalled()
  })
})
