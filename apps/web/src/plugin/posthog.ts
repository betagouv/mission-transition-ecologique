import posthog from 'posthog-js'
import { type App } from 'vue'
import Config from '@/config'
export default {
  install(app: App) {
    app.config.globalProperties['$posthog'] = posthog.init(Config.posthogApiKey, {
      api_host: 'https://eu.i.posthog.com',
      capture_pageview: false,
      person_profiles: 'always'
    })
  }
}
