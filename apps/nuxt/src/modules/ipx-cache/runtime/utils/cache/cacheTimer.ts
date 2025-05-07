export class CacheTimer {
  private timers = new Map<string, NodeJS.Timeout>()

  set(path: string, callback: () => void, ttl: number): void {
    const timeout = setTimeout(callback, ttl * 1000)
    this.timers.set(path, timeout)
  }

  clear(path: string): void {
    if (this.timers.has(path)) {
      clearTimeout(this.timers.get(path))
      this.timers.delete(path)
    }
  }

  clearAll(): void {
    for (const timer of this.timers.values()) {
      clearTimeout(timer)
    }
    this.timers.clear()
  }
}
