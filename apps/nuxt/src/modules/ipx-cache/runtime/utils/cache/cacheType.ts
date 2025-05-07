import type { OutgoingHttpHeaders } from 'http'

export interface CachedData {
  meta: OutgoingHttpHeaders
  buffer: Buffer
}

export interface CacheStorage {
  set: (path: string, val: CachedData, ttl?: number) => Promise<void>
  get: (path: string) => Promise<CachedData | undefined>
  del: (path: string) => Promise<void>
  clear: () => Promise<void>
}
