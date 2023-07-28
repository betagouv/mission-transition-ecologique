import express, { Express, NextFunction, Request, Response } from 'express'
// import router from './controller/routes.js'
import { RegisterRoutes } from '../../generated/routes'
import swaggerUi from 'swagger-ui-express'
import { ValidateError } from 'tsoa'

const app: Express = express()

app.use(express.json())

app.use('/api/docs', swaggerUi.serve, async (_req: Request, res: Response) => {
  return res.send(swaggerUi.generateHTML(await import('../../generated/swagger.json')))
})

RegisterRoutes(app)

app.use(function notFoundHandler(_req, res: Response) {
  res.status(404).send({ message: 'Not Found' })
})

app.use(function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
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
