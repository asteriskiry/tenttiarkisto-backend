const express = require('express')
const path = require('path')
const logger = require('morgan')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const moment = require('moment')
const pg = require('../db/pg')
const Context = require('./context')
const routes = require('./routes')

moment.locale('fi')
const app = express()

logger.token('statuscolor', (req, res) => {
  const status = res.headersSent ? res.statusCode : undefined
  const color = status >= 500 ? 31 // red
    : status >= 400 ? 33 // yellow
      : status >= 300 ? 36 // cyan
        : status >= 200 ? 32 // green
          : 0 // no color
  return '\x1b[' + color + 'm' + status + '\x1b[0m'
})

if(process.env.NODE_ENV !== 'test') {
  let loggerOutputFormat = ''
  if(process.env.NODE_ENV === 'development') {
    loggerOutputFormat = ':method :url :statuscolor :response-time ms - :res[content-length]'
  } else {
    loggerOutputFormat = '[:date[iso]] :remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms'
  }
  app.use(logger(loggerOutputFormat))
}

process.env.NODE_ENV === 'production' && app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Setup req.context of which can be used for storing various stuff along requests
app.use((req, res, next) => {
  if(req.context) {
    return next()
  }
  req.context = new Context(pg.db)
  req.context.pgp = pg.pgp
  return next()
})

app.get('/', (req, res) => res.send({ message: 'Working' }))
app.get('/ping', (req, res) => res.send({ message: 'pong' }))
app.use('/api', routes)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use((err, req, res) => {
  // Comment out next line if error message needed for tests etc
  // console.error(JSON.stringify(err, null, 4), err)
  res.status(err.status || 500)
  if(err.status === 400 || err.status === 401) {
    res.send({ message: err.message, validationErrors: err.data })
  } else {
    if(process.env.NODE_ENV !== 'test') {
      console.error(err)
    }
    res.send({ message: err.message })
  }
})

module.exports = app
