const path = require('path')
const { db, pgp } = require('./pg')

const loadSql = file => {
  const fullPath = path.join(__dirname, file)
  return new pgp.QueryFile(fullPath, { minify: true })
}

const initializeDbSql = loadSql('../sql/000-initial.sql')

db.any(initializeDbSql)
  .then((d) => {
    console.log('Database initialized', d)
  })
  .catch(error => {
    const errorMessage = error instanceof pgp.errors.QueryFileError
      ? 'PGP error'
      : 'Unkown error'
    console.error(errorMessage, error)
  })