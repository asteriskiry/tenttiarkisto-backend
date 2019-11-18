const monitor = require('pg-monitor')

const enableMonitoring = ['development', 'test'].includes(process.env.NODE_ENV) || process.env.MONITOR_PG
const log = require('simple-node-logger').createSimpleFileLogger(`logs/db_${process.env.NODE_ENV}.log`)

const pgPromiseOptions = {
  capSQL: true
}

const pgp = require('pg-promise')(pgPromiseOptions)

const setupDbMonitoring = (options) => {
  monitor.attach(options, ['query', 'error'])
  monitor.setTheme('matrix')
  monitor.setLog((msg, info) => {
    log.info(info.text)
    info.display = false
  })
}
enableMonitoring && setupDbMonitoring(pgPromiseOptions)

const getDbName = () => {
  switch(process.env.NODE_ENV) {
    case 'test':
      return 'tentit_testing'
    case 'production':
      return 'tentit'
    case 'staging':
      return 'tentit_staging'
    case 'development':
      return 'tentit_dev'
    default:
      if(process.env.PGDATABASE) {
        return process.env.PGDATABASE
      }
      throw new Error('INVALID ENVIRONMENT, cannot determine database name')
  }
}

const connectionOptions = {
  user: process.env.PGUSER || 'tentit',
  host: process.env.PGHOST || 'localhost',
  password: process.env.PGPASSWORD || 'tentit',
  database: getDbName(),
  port: process.env.PGPORT || 54321
}

const db = pgp(connectionOptions)

module.exports = {
  db,
  pgp
}