import { CacheManager } from '@/modules/ipx-cache/runtime/utils/cache/cacheManager'
import { EventHandlerRequest, H3Event } from 'h3'
import { CaptureStream } from './captureStream'
import { ServerResponse } from 'http'
import { PassThrough } from 'node:stream'

export class ResponseHandler {
  private _passThrough: PassThrough
  private _captureStream: CaptureStream
  private _originalRes: ServerResponse

  constructor(
    private _event: H3Event<EventHandlerRequest>,
    private _cacheManager: CacheManager,
    private _requestUrl: string
  ) {
    this._originalRes = _event.node.res as ServerResponse
    this._passThrough = new PassThrough()
    this._captureStream = new CaptureStream()
    this._passThrough.pipe(this._captureStream)
  }

  public setupResponseOverrides(): void {
    const originalWrite = this._originalRes.write.bind(this._originalRes)
    const originalEnd = this._originalRes.end.bind(this._originalRes)

    this._originalRes.write = this._createWriteOverride(originalWrite)
    this._originalRes.end = this._createEndOverride(originalEnd)
  }

  private _createWriteOverride(originalWrite: typeof ServerResponse.prototype.write): typeof ServerResponse.prototype.write {
    return (
      chunk: any,
      encodingOrCallback?: BufferEncoding | ((error: Error | null | undefined) => void),
      callback?: (error: Error | null | undefined) => void
    ): boolean => {
      this._passThrough.write(chunk, encodingOrCallback as BufferEncoding, callback)
      return originalWrite(chunk, encodingOrCallback as BufferEncoding, callback)
    }
  }

  private _createEndOverride(originalEnd: typeof ServerResponse.prototype.end): typeof ServerResponse.prototype.end {
    return (chunk?: any, encodingOrCallback?: BufferEncoding | (() => void), callback?: () => void): ServerResponse => {
      if (chunk) {
        this._passThrough.write(chunk, encodingOrCallback as BufferEncoding, callback)
      }

      setHeaders(this._event, { 'cache-status': 'MISS' })

      if (typeof encodingOrCallback === 'function') {
        originalEnd(chunk, encodingOrCallback)
      } else {
        originalEnd(chunk, encodingOrCallback as BufferEncoding, callback)
      }

      if (this._originalRes.statusCode !== 200) {
        return this._originalRes
      }

      if (this._originalRes.statusCode === 200) {
        const buffer = this.getBuffer()
        this._cacheManager.saveToCache(this._requestUrl, buffer, this._originalRes.getHeaders())
      }

      return this._originalRes
    }
  }

  getBuffer(): Buffer {
    return this._captureStream.getBuffer()
  }
}
