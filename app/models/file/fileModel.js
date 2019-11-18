const { NotFound } = require('http-errors')
const { now } = require('../helpers/helpers')

const file = {}

file.findById = (db, id) => {
  if(!id) {
    throw new NotFound('File not found')
  }
  return db.one('SELECT * FROM file WHERE file_id = $1', id)
}

file.findByName = (db, name) =>
  db.one(`SELECT * FROM file WHERE file_data->>'filename' = $1`, name)

file.findAll = db => db.any(`SELECT * FROM file`)

file.save = (db, data, id) => id
  ? update(db, data, id)
  : create(db, data)

file.saveBatch = (db, files) => db.tx(t =>
  t.batch(files.map(file => create(t, file))))

const create = (db, data) => {
  const dataWithTimestamp = {
    ...data,
    createdAt: now()
  }
  const sql = `INSERT INTO file (file_data)
      VALUES ($[dataWithTimestamp]) RETURNING file_id`
  const params = { dataWithTimestamp }
  return db.one(sql, params)
    .then(result => file.findById(db, result.file_id))
}

const update = (db, { id: __, ...data }, fileId) => {
  const dataWithTimestamp = {
    ...data,
    updatedAt: now()
  }

  const sql = `UPDATE file 
  SET file_data = $[dataWithTimestamp]
  WHERE file_id = $[fileId] RETURNING file_id`
  const params = {
    fileId,
    dataWithTimestamp
  }
  return db.one(sql, params)
    .then(result => file.findById(db, result.file_id))
}

file.remove = (db, id) => {
  if(!id) { throw new NotFound('File not found') }
  return db.one('DELETE FROM file WHERE file_id = $1 RETURNING file_id', id)
}

module.exports = file
