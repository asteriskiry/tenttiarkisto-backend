const { Sequelize } = require('sequelize')

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

const sequelize = new Sequelize(getDbName(), process.env.PGUSER || 'tentit', process.env.PGPASSWORD || 'tentit', {
    host: process.env.PGHOST || 'localhost',
    port: process.env.PGPORT || 54321,
    dialect: 'postgres'
})

module.exports = sequelize