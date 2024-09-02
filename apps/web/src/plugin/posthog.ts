import posthog from 'posthog-js'
import Config from '@/config'
import { type App } from 'vue'
import { useNavigationStore } from '@/stores/navigation'

export default {
  install(app: App) {
    const posthogCookie = useNavigationStore().getCookieByValue('posthog')
    if (posthogCookie?.accepted) {
      app.config.globalProperties['$posthog'] = posthog.init(Config.posthogApiKey, {
        api_host: 'https://eu.i.posthog.com',
        capture_pageview: false
      })
    }
  }
}
