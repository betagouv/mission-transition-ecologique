import type { OutgoingHttpHeaders } from 'http'

import { createStorage } from 'unstorage'
import fsDriver from 'unstorage/drivers/fs'

const STORE_FMT: BufferEncoding = 'base64'

/**
 * @param cacheDir Persistance cache directory. Leave blank to cache data in memory
 * @param defaultTTL Default TTL in seconds
 * */
export function createCache(cacheDir: string, defaultTTL = 86400) {
  const store = createStorage<string>({ driver: fsDriver({ base: cacheDir }) })
  const timers = new Map<string, NodeJS.Timeout>()

  return <CacheStorage>{
    async get(path) {
      const raw = await store.getItem(path)
      if (!raw) return

      if (!timers.has(path)) {
        const timeout = setTimeout(() => this.del(path), defaultTTL)
        timers.set(path, timeout)
      }

      const meta = await store.getItem(`${path}.json`)
      return { meta, buffer: Buffer.from(raw, STORE_FMT) }
    },

    async set(path, v, ttl = defaultTTL) {
      if (timers.has(path)) {
        clearTimeout(timers.get(path))
      }

      const timeout = setTimeout(() => this.del(path), ttl * 1000)
      console.log('timer set', { path, timeout })
      await Promise.all([store.setItem(path, v.buffer.toString(STORE_FMT)), store.setItem(`${path}.json`, JSON.stringify(v.meta))]).catch(
        console.trace
      )

      timers.set(path, timeout)
    },

    async del(path) {
      if (timers.has(path)) clearTimeout(timers.get(path))
      timers.delete(path)

      const promises = [store.removeItem(path), store.removeItem(`${path}.json`)]
      await Promise.all(promises).catch(() => void 0)
    },

    clear() {
      store.clear()
      for (const v of timers.values()) clearTimeout(v)
      timers.clear()
    }
  }
}

interface CachedData {
  meta: OutgoingHttpHeaders
  buffer: Buffer
}

interface CacheStorage {
  set: (path: string, val: CachedData, ttl?: number) => Promise<void>
  get: (path: string) => Promise<CachedData | undefined>
  del: (path: string) => Promise<void>
  clear: () => void
}
