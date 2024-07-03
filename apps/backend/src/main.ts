import app from './app'
const port = 3000

const server = app.listen(port, () => console.log(`App listening at http://localhost:${port}`))
server.on('error', console.error)
