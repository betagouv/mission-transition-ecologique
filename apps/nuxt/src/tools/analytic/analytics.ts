import Posthog from '@/tools/analytic/posthog'
import Cookie from '@/tools/cookies'
import { CookieValue } from '@/types/cookies'
import Matomo from './matomo'

export default class Analytics {
  static sendEvent(action: string, name: string | null = null, value?: string | number | object | Record<string, string | number>) {
    const posthogCookie = Cookie.getCookieByValue(CookieValue.Posthog)
    if (posthogCookie?.accepted) {
      Posthog.captureEvent(action, name ? name : 'unnamed event', value)
    }
    if (import.meta.client) {
      Matomo.sendEvent(action, name, JSON.stringify(value))
    }
  }
}
