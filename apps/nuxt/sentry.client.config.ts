import * as Sentry from '@sentry/nuxt'
import type { SentryNuxtClientOptions } from '@sentry/nuxt/build/types/common/types'
import Config from './src/config'
import type { Options } from '@sentry/types'

const config = useRuntimeConfig()

const options: Options | SentryNuxtClientOptions = {
  integrations: [
    Sentry.browserTracingIntegration()
    // Sentry.piniaIntegration(usePinia())
  ],
  normalizeDepth: 10,
  environment: config.public.sentry.environment ?? Config.SENTRY_ENVIRONMENT,
  trackComponents: true,

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0.5,

  // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ['/^localhost/', /^https:\/\/mission-transition-ecologique\.beta\.gouv\.fr\/api/, /^\/api\//],

  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0
}

if (config.public.sentry.dsn) {
  options.dsn = config.public.sentry.dsn
}

Sentry.init(options)
