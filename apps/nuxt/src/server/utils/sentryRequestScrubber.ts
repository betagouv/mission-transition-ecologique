import type { Event } from '@sentry/core'

// The requestDataIntegration of Sentry attaches every request header to the events, Authorization included:
// partner API keys (POST /api/opportunities) must not leave the server
export class SentryRequestScrubber {
  static readonly sensitiveHeaders = ['authorization']

  static scrub<T extends Event>(event: T): T {
    const headers = event.request?.headers
    if (!headers) {
      return event
    }

    // Header names are case-insensitive: the event may keep the case sent by the client
    for (const name of Object.keys(headers)) {
      if (this.sensitiveHeaders.includes(name.toLowerCase())) {
        delete headers[name]
      }
    }

    return event
  }
}
