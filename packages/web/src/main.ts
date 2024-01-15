import { type Component, createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from '@/router'
import WebApp from '@/WebApp.vue'
import VueDsfr from '@gouvminint/vue-dsfr'
// Styles imports
import './assets/main.css'
import '@gouvfr/dsfr/dist/core/core.main.min.css'
import { listIcons } from '@/icons'
import * as Sentry from '@sentry/vue'

const store = createPinia()

const app = createApp(WebApp as Component)

Sentry.init({
  app,
  integrations: [
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router)
    }),
    new Sentry.Replay()
  ],
  environment: 'preprod',

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,

  // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],

  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0
})

app.use(VueDsfr, { icons: listIcons() })
app.use(store)
app.use(router)
app.mount('#app')
