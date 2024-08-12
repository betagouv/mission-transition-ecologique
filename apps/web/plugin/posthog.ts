import posthog from 'posthog-js'
import Config from '../src/config'
import { type App } from 'vue'

export default {
  install(app: App) {
    app.config.globalProperties['$posthog'] = posthog.init(Config.posthogApiKey, {
      api_host: 'https://eu.i.posthog.com'
    })
  }
}
