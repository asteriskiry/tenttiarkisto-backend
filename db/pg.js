const monitor = require('pg-monitor')

const pgp = require('pg-promise')()

if(process.env.PG_MONITOR) {
  monitor.attach(options)
  monitor.setTheme('matrix')
}

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
  host: process.env.PGHOST || 'db',
  password: process.env.PGPASSWORD || 'tentit',
  database: getDbName(),
  port: process.env.PGPORT || 54321
}
const db = pgp(connectionOptions)

module.exports = {
  db,
  pgp
}