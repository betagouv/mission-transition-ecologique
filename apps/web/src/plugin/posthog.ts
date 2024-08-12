import posthog from 'posthog-js'
import { type App } from 'vue'

export default {
  install(app: App) {
    if (process.env.POSTHOG_API_KEY) {
      app.config.globalProperties['$posthog'] = posthog.init(process.env.POSTHOG_API_KEY, {
        api_host: 'https://eu.i.posthog.com',
        capture_pageview: false,
        person_profiles: 'always'
      })
    }
  }
}
