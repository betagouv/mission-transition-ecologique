import Posthog from '@/utils/analytic/posthog'
import Cookie from '@/utils/cookies'
import { CookieValue } from '@/types/cookies'
import Matomo from './matomo'

export default class Analytics {
  static sendEvent(action: string, name: string | null = null, value?: string | number | object | Record<string, string | number>) {
    const posthogCookie = Cookie.getCookieByValue(CookieValue.Posthog)
    if (posthogCookie?.accepted) {
      Posthog.captureEvent(action, name ? name : 'unnamed event', value)
    }

    Matomo.sendEvent(action, name, JSON.stringify(value))
  }
}
