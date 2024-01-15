import express, { Express, NextFunction, Request, Response } from 'express'
import { RegisterRoutes } from '../generated/routes'
import swaggerUi from 'swagger-ui-express'
import { ValidateError } from 'tsoa'
import cors from 'cors'
import * as Sentry from '@sentry/node'
import { Integrations } from '@sentry/node'

const app: Express = express()

Sentry.init({
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Integrations.Express({ app })
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0.5,
  environment: 'preprod'
})

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler())
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())

app.use(express.json())
app.use(cors())

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.use('/api/docs', swaggerUi.serve, async (_req: Request, res: Response) => {
  return res.send(swaggerUi.generateHTML(await import('../generated/swagger.json')))
})

app.get('/debug-sentry', function mainHandler() {
  throw new Error('My first Sentry error!')
})

RegisterRoutes(app)

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler())

app.use(function notFoundHandler(_req, res: Response) {
  res.status(404).send({ message: 'Not Found' })
})

app.use(function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): Response | void {
  if (err instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}:`, err.fields)
    return res.status(422).json({
      message: 'Validation Failed',
      details: err?.fields
    })
  }

  if (err instanceof Error) {
    return res.status(500).json({
      message: 'Internal Server Error'
    })
  }

  next()
})

export default app
