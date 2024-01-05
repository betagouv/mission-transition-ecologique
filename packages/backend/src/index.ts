import app from './app'

import * as dotenv from 'dotenv'

dotenv.config()

const port: number = parseInt(process.env['PORT'] || '')
app.listen(port, () => console.log(`App listening at http://localhost:${port}`))
