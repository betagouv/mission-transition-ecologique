import * as fs from 'fs'
import { LinkStatus } from './linkStatus'

interface PersistedCache {
  version: 1
  // url → ISO date of the last check that found the link valid
  validLinks: Record<string, string>
}

const DAY_IN_MS = 24 * 60 * 60 * 1000
const DEFAULT_TTL_DAYS = 3

/**
 * In-memory cache for the current run, optionally backed by a JSON file shared between runs.
 *
 * Only valid links are persisted: broken or unverifiable links are checked again on every run,
 * so that a fixed link disappears from the report the next day.
 * A persisted valid link is trusted for ttlDays at most (between ttlDays / 2 and ttlDays,
 * spread per link so that the links are not all checked again on the same day).
 * A link that breaks is therefore reported at most ttlDays after its breakage.
 *
 * Several processes may share the file (e.g. the scripts chained by generate:programs):
 * a process writes only when it checked links, and merges its results into the current file content.
 */
export class LinkValidatorCache {
  private _store: Map<string, LinkStatus> = new Map()
  private _validLinks: Record<string, string> = {}
  // Links checked during this run: ISO date when valid, undefined when not valid anymore
  private _changes: Map<string, string | undefined> = new Map()

  constructor(
    private readonly _filePath?: string,
    private readonly _ttlDays = 0,
    private readonly _now: () => number = () => Date.now()
  ) {
    this._validLinks = this._read()
  }

  /**
   * Builds the cache from LINK_VALIDATOR_CACHE_FILE (no persistence when empty)
   * and LINK_VALIDATOR_CACHE_TTL_DAYS (default 3 when empty or invalid, 0 to check every link again).
   */
  static fromEnv(): LinkValidatorCache {
    const filePath = process.env['LINK_VALIDATOR_CACHE_FILE'] || undefined
    const cache = new LinkValidatorCache(filePath, LinkValidatorCache.parseTtlDays(process.env['LINK_VALIDATOR_CACHE_TTL_DAYS']))
    if (filePath) {
      // 'exit' handlers only allow synchronous work: save() uses synchronous fs calls
      process.once('exit', () => cache.save())
    }
    return cache
  }

  static parseTtlDays(value: string | undefined): number {
    if (value === undefined || value.trim() === '') {
      return DEFAULT_TTL_DAYS
    }
    const ttlDays = Number(value)
    return Number.isFinite(ttlDays) && ttlDays >= 0 ? ttlDays : DEFAULT_TTL_DAYS
  }

  has(link: string): boolean {
    return this.get(link) !== undefined
  }

  get(link: string): LinkStatus | undefined {
    const status = this._store.get(link)
    if (status !== undefined) {
      return status
    }
    return this._isFresh(this._validLinks[link], link) ? LinkStatus.Valid : undefined
  }

  set(link: string, status: LinkStatus): void {
    this._store.set(link, status)
    if (this._filePath) {
      this._changes.set(link, status === LinkStatus.Valid ? new Date(this._now()).toISOString() : undefined)
    }
  }

  clear(): void {
    this._store.clear()
  }

  get size(): number {
    return this._store.size
  }

  /**
   * Merges the links checked during this run into the current file content, then drops the expired links.
   * Does nothing when no link was checked, so that a process without any check cannot empty the file.
   * With a TTL of 0, the links not checked by this process are kept: the next run drops them according to their age.
   */
  save(): void {
    if (!this._filePath || this._changes.size === 0) {
      return
    }
    const merged = { ...this._read() }
    for (const [link, checkedAt] of this._changes) {
      if (checkedAt) {
        merged[link] = checkedAt
      } else {
        delete merged[link]
      }
    }

    const validLinks: Record<string, string> = {}
    for (const link of Object.keys(merged).sort()) {
      if (this._changes.has(link) || this._ttlDays <= 0 || this._isFresh(merged[link], link)) {
        validLinks[link] = merged[link]
      }
    }

    const content: PersistedCache = { version: 1, validLinks }
    // Write then rename, so that an interrupted write cannot leave a truncated file
    const tmpPath = `${this._filePath}.${process.pid}.tmp`
    try {
      fs.writeFileSync(tmpPath, JSON.stringify(content, null, 2), 'utf8')
      fs.renameSync(tmpPath, this._filePath)
    } catch (error) {
      console.warn(`Impossible d'écrire le cache des liens (${this._filePath})`, error)
      fs.rmSync(tmpPath, { force: true })
    }
  }

  private _read(): Record<string, string> {
    if (!this._filePath || !fs.existsSync(this._filePath)) {
      return {}
    }
    try {
      const content = JSON.parse(fs.readFileSync(this._filePath, 'utf8')) as Partial<PersistedCache>
      if (content.version !== 1 || typeof content.validLinks !== 'object' || content.validLinks === null) {
        return {}
      }
      // Keep only well-formed entries: url → parsable date
      return Object.fromEntries(
        Object.entries(content.validLinks).filter(([, checkedAt]) => typeof checkedAt === 'string' && !isNaN(new Date(checkedAt).getTime()))
      )
    } catch (error) {
      console.warn(`Cache des liens illisible, il est ignoré (${this._filePath})`, error)
      return {}
    }
  }

  private _isFresh(checkedAt: string | undefined, link: string): boolean {
    if (!checkedAt || this._ttlDays <= 0) {
      return false
    }
    const age = this._now() - new Date(checkedAt).getTime()
    return age >= 0 && age < this._ttlDays * DAY_IN_MS * this._spreadFactor(link)
  }

  // Deterministic factor in [0.5, 1) derived from the url
  private _spreadFactor(link: string): number {
    let hash = 0
    for (let i = 0; i < link.length; i++) {
      hash = (hash * 31 + link.charCodeAt(i)) >>> 0
    }
    return 0.5 + (hash % 1000) / 2000
  }
}
