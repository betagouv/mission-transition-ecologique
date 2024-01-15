import express, { Express, NextFunction, Request, Response } from 'express'
import { RegisterRoutes } from '../generated/routes'
import swaggerUi from 'swagger-ui-express'
import { ValidateError } from 'tsoa'
import cors from 'cors'
import Sentry from './plugin/sentry'
import * as dotenv from 'dotenv'

dotenv.config()

const app: Express = express()

Sentry.init(app)
app.use(Sentry.requestHandler())
app.use(Sentry.tracingHandler())

app.use(express.json())
app.use(cors())

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.use('/api/docs', swaggerUi.serve, async (_req: Request, res: Response) => {
  return res.send(swaggerUi.generateHTML(await import('../generated/swagger.json')))
})

RegisterRoutes(app)

app.use(Sentry.errorHandler())

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
