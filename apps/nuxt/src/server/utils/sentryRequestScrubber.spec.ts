// @vitest-environment node
import type { Event } from '@sentry/core'
import { describe, expect, it } from 'vitest'
import { SentryRequestScrubber } from './sentryRequestScrubber'

describe('SentryRequestScrubber', () => {
  it.each([['authorization'], ['Authorization'], ['AUTHORIZATION']])('removes the %s header', (name) => {
    const event: Event = {
      request: { url: '/api/opportunities', headers: { [name]: 'Bearer secret-key', 'content-type': 'application/json' } }
    }

    expect(SentryRequestScrubber.scrub(event).request?.headers).toEqual({ 'content-type': 'application/json' })
  })

  it('keeps an event without request headers unchanged', () => {
    const event: Event = { message: 'Opportunity rejected' }

    expect(SentryRequestScrubber.scrub(event)).toEqual({ message: 'Opportunity rejected' })
  })
})
