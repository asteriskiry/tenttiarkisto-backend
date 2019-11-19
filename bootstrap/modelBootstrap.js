const sequelize = require('../db/sequelize')

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

const run = async () => {
    console.log('*** RUNNING MODELBOOTSTRAP ***')

    if (process.env.DROP_ON_START) await sequelize.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;')

    const Subject = require('../models/Subject')
    const Course = require('../models/Course')
    const File = require('../models/File')



    await sequelize.sync()
}

module.exports = run 