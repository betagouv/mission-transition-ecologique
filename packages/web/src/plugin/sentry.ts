import { router } from '@/router'
import type { App } from 'vue'
import * as SentryVue from '@sentry/vue'
import type { Options, TracingOptions } from '@sentry/vue/types/types'
import Config from '@/config'

export default class Sentry {
  static init(app: App) {
    const options: SentryVue.BrowserOptions = this._defaultOptions(app)

    if (Config.SENTRY_DSN) {
      options.dsn = Config.SENTRY_DSN
    }

    SentryVue.init(options)
  }

  private static _defaultOptions = (app: App): Partial<Omit<Options, 'tracingOptions'> & { tracingOptions: Partial<TracingOptions> }> => {
    return {
      app: app,
      integrations: [
        new SentryVue.BrowserTracing({
          routingInstrumentation: SentryVue.vueRouterInstrumentation(router)
        }),
        SentryVue.replayIntegration()
      ],
      environment: Config.SENTRY_ENVIRONMENT,

      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 0.5,

      // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ['localhost', /^https:\/\/tee-backend(-staging|-preprod).osc-fr1.scalingo.io\/api/],

      // Capture Replay for 10% of all sessions,
      // plus for 100% of sessions with an error
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0
    }
  }
}
