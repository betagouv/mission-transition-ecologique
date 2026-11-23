import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import { LinkStatus } from '../../../../src/common/validators/linkStatus'
import { LinkValidatorCache } from '../../../../src/common/validators/linkValidatorCache'

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
    second.save()
    expect(persistedLinks()).toEqual([])
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

  it('ignores an unreadable cache file', () => {
    fs.writeFileSync(filePath, 'not json')
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)

    expect(runAt(START).get('https://ok.fr')).toBeUndefined()
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })
})
