if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const http = require('http')
const app = require('../app')

const isTesting = process.env.NODE_ENV === 'test'
const port = isTesting ? (process.env.TEST_PORT || '3012') : (process.env.PORT || '3002')
app.set('port', port)

const { db } = require('../db/pg')

const sequelize = require('../db/sequelize')
if (process.env.MODEL_BOOTSTRAP) require('../bootstrap/modelBootstrap')(sequelize)

const server = http.createServer(app)
server.on('close', () => {
  db.$pool.end()
})

const startServer = () =>
  new Promise(resolve => {
    server.listen(port, () => {
      console.log(`Server listening port ${port}`)
      resolve()
    })
  })
    .catch(err => {
      console.error(err)
      process.exit(1)
    })

const gracefulShutdown = () => {
  console.log('Received kill signal, shutting down gracefully.')
  server.close(() => {
    db.proc('version')
      .then((data) => {
        console.log('SIG CONNECTION ACTIVE', data)
      })
      .catch(error => {
        console.log('SIG ERROR', error)
      })
    process.exit(0)
  })
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down')
    process.exit(0)
  }, 10 * 1000)
}

process.on('SIGINT', gracefulShutdown)

startServer()

module.exports = {
  app,
  server
}
