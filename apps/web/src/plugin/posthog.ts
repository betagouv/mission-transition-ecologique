import posthog from 'posthog-js'
import Config from '@/config'
import { type App } from 'vue'

export default {
  install(app: App) {
    app.config.globalProperties['$posthog'] = posthog.init(Config.posthogApiKey, {
      api_host: 'https://eu.i.posthog.com',
      capture_pageview: false,
      person_profiles: 'always',
      loaded: function (ph) {
        if (Config.isDevelopment) {
          ph.opt_out_capturing()
          ph.set_config({ disable_session_recording: true })
        }
      }
    })
  },
  activatePosthogCookie(app: App) {
    app.config.globalProperties['$posthog'].opt_in_capturing()
  },
  deactivatePosthogCookie(app: App) {
    app.config.globalProperties['$posthog'].opt_out_capturing()
  }
}
