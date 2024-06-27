import * as SentryNode from '@sentry/node'
import { Integrations } from '@sentry/node'
import express, { Express } from 'express'
import { Config } from '@tee/backend-ddd'

export default class Sentry {
  static init(app: Express) {
    const options: SentryNode.NodeOptions = this._defaultOptions(app)

    if (Config.SENTRY_DSN) {
      options.dsn = Config.SENTRY_DSN
    }

    SentryNode.init(options)
  }

  private static _defaultOptions = (app: Express): SentryNode.NodeOptions => {
    return {
      integrations: [
        // enable HTTP calls tracing
        new SentryNode.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Integrations.Express({ app })
      ],

      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 0.5,
      environment: Config.SENTRY_ENVIRONMENT
    }
  }

  /**
   * RequestHandler creates a separate execution context using domains, so that every
   * transaction/span/breadcrumb is attached to its own Hub instance
   */
  static requestHandler = () => SentryNode.Handlers.requestHandler()

  /**
   * TracingHandler creates a trace for every incoming request
   */
  static tracingHandler = () => SentryNode.Handlers.tracingHandler() as express.RequestHandler

  /**
   * The error handler must be before any other error middleware and after all controllers
   */
  static errorHandler = () => SentryNode.Handlers.errorHandler() as express.ErrorRequestHandler
}
