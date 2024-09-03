import posthog from 'posthog-js'
import Config from '@/config'
import { type App } from 'vue'
import Cookie from '@/utils/cookies'
import { CookieValue } from '@/types/cookies'

export default {
  install(app: App) {
    const posthogCookie = Cookie.getCookieByValue(CookieValue.Posthog)
    if (posthogCookie?.accepted) {
      app.config.globalProperties['$posthog'] = posthog.init(Config.posthogApiKey, {
        api_host: 'https://eu.i.posthog.com',
        capture_pageview: false
      })
    }
  }
}
