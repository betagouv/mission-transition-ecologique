import * as Sentry from '@sentry/nuxt'
import type { SentryNuxtServerOptions } from '@sentry/nuxt/build/types/common/types'
import type { ErrorEvent, Options, TransactionEvent } from '@sentry/core'
import { Config } from '@tee/backend-ddd'
import { SentryRequestScrubber } from './src/server/utils/sentryRequestScrubber'

const options: Options | SentryNuxtServerOptions = {
  environment: Config.SERVER_ENVIRONMENT,

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0.01,

  // Partner API keys are sent in the Authorization header, which Sentry attaches to errors and transactions
  beforeSend: (event: ErrorEvent) => SentryRequestScrubber.scrub(event),
  beforeSendTransaction: (event: TransactionEvent) => SentryRequestScrubber.scrub(event)
}

if (Config.SENTRY_DSN) {
  options.dsn = Config.SENTRY_DSN
}

Sentry.init(options)
