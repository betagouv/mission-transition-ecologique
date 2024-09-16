import { QuestionnaireData } from '@tee/common'
import { ProgramType } from '@tee/data'
import { createHash } from 'crypto'
import { Result } from 'true-myth'

class ProgramCache {
  private static instance: ProgramCache
  private cachedElements: Map<string, { data: ProgramType[]; timestamp: number }>
  private _ttl = 10 * 60 * 1000
  private _maxSize = 1000

  private constructor() {
    this.cachedElements = new Map()
    this._startCleanupTask()
  }

  public static getInstance(): ProgramCache {
    if (!ProgramCache.instance) {
      ProgramCache.instance = new ProgramCache()
    }
    return ProgramCache.instance
  }

  public generateHash(obj: QuestionnaireData): string {
    const hash = createHash('sha256')
    hash.update(JSON.stringify(obj))
    return hash.digest('hex')
  }

  public setCache(hash: string, data: ProgramType[]): void {
    if (this.cachedElements.size >= this._maxSize) {
      const oldestKey = this.cachedElements.keys().next().value
      this.cachedElements.delete(oldestKey)
    }

    this.cachedElements.set(hash, { data, timestamp: Date.now() })
  }

  public getCache(hash: string): Result<ProgramType[], Error> | null {
    const cached = this.cachedElements.get(hash)
    if (cached && Date.now() - cached.timestamp < this._ttl) {
      return Result.ok(cached.data)
    }
    return null
  }

  private _startCleanupTask(): void {
    setInterval(() => {
      const now = Date.now()
      this.cachedElements.forEach((value, key) => {
        if (now - value.timestamp >= this._ttl) {
          this.cachedElements.delete(key)
        }
      })
      // TODO : need to be test
    }, this._ttl + 5)
  }
}

export default ProgramCache
