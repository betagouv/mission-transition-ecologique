import Cookie from '@/utils/cookies'
import { CookieValue } from '@/types/cookies'
import { app } from '../main'

export default class Analytics {
  static sendEvent(action: string, name: string | null = null, value?: string | number | object | Record<string, string | number>) {
    const posthogCookie = Cookie.getCookieByValue(CookieValue.Posthog)
    if (posthogCookie?.accepted) {
      app.config.globalProperties['$posthog'].capture(name ? name : 'unnamed event', { action: action, value: value })
    }
  }
}
