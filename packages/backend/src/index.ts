import express, { Express } from 'express'
import router from './controller/routes.js'

import * as dotenv from 'dotenv'

dotenv.config()

const app: Express = express()
const port: number = parseInt(process.env['PORT'] || '')

app.use(express.json())

app.use('/api', router)

app.listen(port)

export default app
