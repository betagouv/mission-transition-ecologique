export class LinkValidatorCache {
  private _store: Map<string, boolean> = new Map()

  has(link: string): boolean {
    return this._store.has(link)
  }

  get(link: string): boolean | undefined {
    return this._store.get(link)
  }

  set(link: string, isValid: boolean): void {
    this._store.set(link, isValid)
  }

  clear(): void {
    this._store.clear()
  }

  get size(): number {
    return this._store.size
  }
}
