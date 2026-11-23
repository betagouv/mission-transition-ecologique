import * as fs from 'fs'
import { LinkStatus } from './linkStatus'

interface PersistedCache {
  version: 1
  // url → ISO date of the last check that found the link valid
  validLinks: Record<string, string>
}

const DAY_IN_MS = 24 * 60 * 60 * 1000

/**
 * In-memory cache for the current run, optionally backed by a JSON file shared between runs.
 *
 * Only valid links are persisted: broken or unverifiable links are checked again on every run,
 * so that a fixed link disappears from the report the next day.
 * A persisted valid link is trusted for ttlDays at most (between ttlDays / 2 and ttlDays,
 * spread per link so that the links are not all checked again on the same day).
 * A link that breaks is therefore reported at most ttlDays after its breakage.
 */
export class LinkValidatorCache {
  private _store: Map<string, LinkStatus> = new Map()
  private _validLinks: Record<string, string> = {}

  constructor(
    private readonly _filePath?: string,
    private readonly _ttlDays = 0,
    private readonly _now: () => number = () => Date.now()
  ) {
    this._load()
  }

  /**
   * Builds the cache from LINK_VALIDATOR_CACHE_FILE (no persistence when empty)
   * and LINK_VALIDATOR_CACHE_TTL_DAYS (default 3, 0 to check every link again).
   */
  static fromEnv(): LinkValidatorCache {
    const filePath = process.env['LINK_VALIDATOR_CACHE_FILE'] || undefined
    const ttlDays = Number(process.env['LINK_VALIDATOR_CACHE_TTL_DAYS'] ?? 3)
    const cache = new LinkValidatorCache(filePath, Number.isFinite(ttlDays) ? ttlDays : 3)
    if (filePath) {
      // 'exit' handlers only allow synchronous work: save() uses writeFileSync
      process.once('exit', () => cache.save())
    }
    return cache
  }

  has(link: string): boolean {
    return this.get(link) !== undefined
  }

  get(link: string): LinkStatus | undefined {
    const status = this._store.get(link)
    if (status !== undefined) {
      return status
    }
    return this._isFreshValidLink(link) ? LinkStatus.Valid : undefined
  }

  set(link: string, status: LinkStatus): void {
    this._store.set(link, status)
    if (!this._filePath) {
      return
    }
    if (status === LinkStatus.Valid) {
      this._validLinks[link] = new Date(this._now()).toISOString()
    } else {
      delete this._validLinks[link]
    }
  }

  clear(): void {
    this._store.clear()
  }

  get size(): number {
    return this._store.size
  }

  /**
   * Writes the valid links still within their TTL, the expired ones are dropped.
   */
  save(): void {
    if (!this._filePath) {
      return
    }
    const validLinks: Record<string, string> = {}
    for (const link of Object.keys(this._validLinks).sort()) {
      // checked valid during this run, or still within its TTL
      if (this._store.get(link) === LinkStatus.Valid || this._isFreshValidLink(link)) {
        validLinks[link] = this._validLinks[link]
      }
    }
    const content: PersistedCache = { version: 1, validLinks }
    try {
      fs.writeFileSync(this._filePath, JSON.stringify(content, null, 2), 'utf8')
    } catch (error) {
      console.warn(`Impossible d'écrire le cache des liens (${this._filePath})`, error)
    }
  }

  private _load(): void {
    if (!this._filePath || !fs.existsSync(this._filePath)) {
      return
    }
    try {
      const content = JSON.parse(fs.readFileSync(this._filePath, 'utf8')) as Partial<PersistedCache>
      if (content.version === 1 && content.validLinks) {
        this._validLinks = content.validLinks
      }
    } catch (error) {
      console.warn(`Cache des liens illisible, il est ignoré (${this._filePath})`, error)
    }
  }

  private _isFreshValidLink(link: string): boolean {
    const checkedAt = this._validLinks[link]
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
