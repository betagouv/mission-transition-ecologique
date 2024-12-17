import { H3Event } from 'h3'

export class CacheKeyBuilder {
  static formEvent = (event: H3Event, prefix: string | undefined = undefined): string => {
    const encodedKey = Buffer.from(event.path).toString('base64').slice(0, 32)
    return prefix ? `${prefix}-${encodedKey}` : encodedKey
  }
}
