import * as Sentry from '@sentry/nuxt'
import type { SentryNuxtServerOptions } from '@sentry/nuxt/build/types/common/types'
import type { Options } from '@sentry/types'
import { Config } from '@tee/backend-ddd'

const options: Options | SentryNuxtServerOptions = {
  environment: Config.SENTRY_ENVIRONMENT,

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0.5
}

if (Config.SENTRY_DSN) {
  options.dsn = Config.SENTRY_DSN
}

Sentry.init(options)
