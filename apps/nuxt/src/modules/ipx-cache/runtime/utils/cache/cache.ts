import { CacheTimer } from '@/modules/ipx-cache/runtime/utils/cache/cacheTimer'
import { CachedData, CacheStorage } from '@/modules/ipx-cache/runtime/utils/cache/cacheType'
import { FsStorageDriver } from '@/modules/ipx-cache/runtime/utils/storage/fsStorageDriver'
import { StorageDriver } from '@/modules/ipx-cache/runtime/utils/storage/storageDriverType'

import { createStorage } from 'unstorage'
import fsDriver from 'unstorage/drivers/fs'

const STORE_FMT: BufferEncoding = 'base64'

export class Cache implements CacheStorage {
  private timer: CacheTimer
  private storage: StorageDriver

  constructor(
    cacheDir: string,
    private defaultTTL = 86400
  ) {
    this.timer = new CacheTimer()
    this.storage = new FsStorageDriver(
      createStorage<string>({
        driver: fsDriver({ base: cacheDir })
      })
    )
  }

  async get(path: string): Promise<CachedData | undefined> {
    const raw = await this.storage.getItem(path)
    if (!raw) {
      return
    }

    this.timer.set(path, () => this.del(path), this.defaultTTL)

    const meta = await this.storage.getItem(`${path}.json`)
    return {
      meta: meta ? JSON.parse(meta) : {},
      buffer: Buffer.from(raw, STORE_FMT)
    }
  }

  async set(path: string, v: CachedData, ttl = this.defaultTTL): Promise<void> {
    this.timer.clear(path)

    await Promise.all([
      this.storage.setItem(path, v.buffer.toString(STORE_FMT)),
      this.storage.setItem(`${path}.json`, JSON.stringify(v.meta))
    ]).catch(console.error)

    this.timer.set(path, () => this.del(path), ttl)
  }

  async del(path: string): Promise<void> {
    this.timer.clear(path)
    await Promise.all([this.storage.removeItem(path), this.storage.removeItem(`${path}.json`)]).catch(() => void 0)
  }

  async clear(): Promise<void> {
    await this.storage.clear()
    this.timer.clearAll()
  }
}
