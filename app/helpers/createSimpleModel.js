const { NotFound } = require('http-errors')
const { now } = require('./helpers')

const createSimpleModel = (tableName) => {
  const model = {}
  const modelIdField = `${tableName}_id`
  const modelDataField = `${tableName}_data`

  model.findById = (db, id) => {
    if(!id) {
      throw new NotFound(`${tableName} not found`)
    }
    return db.one(`SELECT * FROM ${tableName} WHERE ${modelIdField} = $1`, id)
  }

  model.findAll = db => db.any(`SELECT * FROM ${tableName}`)

  model.save = (db, data, id) => id
    ? update(db, data, id)
    : create(db, data)

  model.saveBatch = (db, models) => db.tx(t =>
    t.batch(models.map(model => create(t, model))))

  const create = (db, data) => {
    const createdAt = now()
    const sql = `INSERT INTO ${tableName} (${modelDataField}, created_at)
      VALUES ($[data], $[createdAt]) RETURNING ${modelIdField}`
    const params = { data, createdAt }
    return db.one(sql, params)
      .then(result => model.findById(db, result[modelIdField]))
  }

  const update = (db, { id: __, ...data }, modelId) => {
    const updatedAt = now()
    const sql = `UPDATE ${tableName} 
  SET ${modelDataField} = $[data], updated_at = $[updatedAt]
  WHERE ${modelIdField} = $[modelId] RETURNING ${modelIdField}`
    const params = {
      modelId,
      data,
      updatedAt
    }
    return db.one(sql, params)
      .then(result => model.findById(db, result[modelIdField]))
  }

  model.remove = (db, id) => {
    if(!id) { throw new NotFound(`${tableName} not found`) }
    return db.one(`DELETE FROM ${tableName} WHERE ${modelIdField} = $1 RETURNING ${modelIdField}`, id)
  }
  return model
}

module.exports = createSimpleModel
