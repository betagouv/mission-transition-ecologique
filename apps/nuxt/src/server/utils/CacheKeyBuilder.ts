import { H3Event } from 'h3'
import crypto from 'node:crypto'
import Config from '~/config'

export class CacheKeyBuilder {
  static MAX_AGE = 60 * 60 * 1 // 1 hours
  static fromEvent = (event: H3Event, prefix: string | undefined = undefined): string => {
    return this._buildKey(this._encode(event.path), prefix)
  }

  private static _buildKey = (encodedKey: string, prefix: string | undefined = undefined): string => {
    return this._getTestPrefix() + (prefix !== undefined ? `${prefix}-${encodedKey}` : encodedKey)
  }

  private static _encode = (data: string): string => {
    return crypto
      .createHash('sha256')
      .update(data)
      .digest('base64')
      .slice(0, 32)
      .replace(/[:/]/g, (match) => (match === ':' ? '+' : '_'))
  }

  private static _getTestPrefix = (): string => {
    return Config.isTestData ? 'test:' : ''
  }
}
