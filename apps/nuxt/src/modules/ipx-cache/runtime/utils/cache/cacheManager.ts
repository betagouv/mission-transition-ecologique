import { OutgoingHttpHeaders } from 'http'
import { Cache } from './cache'
import { CachedData, CacheStorage } from './cacheType'
import { EventHandlerRequest, H3Event, sendStream, setHeaders } from 'h3'
import { Readable } from 'node:stream'

export class CacheManager {
  private cacheStore: CacheStorage

  constructor(cacheDir: string, defaultTTL = 86400) {
    this.cacheStore = new Cache(cacheDir, defaultTTL)
  }

  async tryGetFromCache(requestUrl: string, event: H3Event<EventHandlerRequest>): Promise<boolean> {
    const cachedData = await this.cacheStore.get(requestUrl)

    if (!cachedData) {
      return false
    }

    await this._sendCachedResponse(cachedData, event)

    return true
  }

  private async _sendCachedResponse(cachedData: CachedData, event: H3Event<EventHandlerRequest>): Promise<void> {
    const readable = new Readable()
    readable._read = () => void 0
    readable.push(cachedData.buffer)
    readable.push(null)

    setHeaders(event, { ...(<NonNullable<unknown>>cachedData.meta), 'cache-status': 'HIT' })

    await sendStream(event, readable)
  }

  saveToCache(requestUrl: string, buffer: Buffer, headers: OutgoingHttpHeaders): void {
    const meta = {
      ...headers,
      'content-length': buffer.byteLength
    }

    this.cacheStore.set(requestUrl, { buffer, meta })
  }
}
