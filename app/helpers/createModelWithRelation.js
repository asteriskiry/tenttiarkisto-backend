const { NotFound } = require('http-errors')
const { now } = require('./helpers')

const createModelWithRelation = (tableName, relationTableName) => {
  const model = {}
  const modelIdField = `${tableName}_id`
  const modelDataField = `${tableName}_data`
  const relationIdFromData = `${relationTableName}Id`
  const relationIdField = `${relationTableName}_id`

  model.findById = (db, id) => {
    if(!id) {
      throw new NotFound(`${tableName} not found`)
    }
    return db.one(`SELECT * FROM ${tableName} WHERE ${modelIdField} = $1`, id)
  }

  model.findAll = (db, relationId) =>
    db.any(`SELECT * FROM ${tableName} ${relationId
      ? `WHERE ${relationIdField} = $[relationId]`
      : ''}`, { relationId })

  model.save = (db, data, id) => id
    ? update(db, data, id)
    : create(db, data)

  model.saveBatch = (db, models) => db.tx(t =>
    t.batch(models.map(model => create(t, model))))

  const create = (db, data) => {
    const { [relationIdFromData]: relationId, ...modelData } = data
    const createdAt = now()
    const sql = `INSERT INTO ${tableName} (${modelDataField}, ${relationIdField}, created_at)
      VALUES ($[modelData], $[relationId], $[createdAt] ) RETURNING ${modelIdField}`
    const params = {
      modelData,
      relationId,
      createdAt
    }
    return db.one(sql, params)
      .then(result => model.findById(db, result[modelIdField]))
  }

  const update = (db, { id: __, ...data }, modelId) => {
    const { [relationIdFromData]: relationId, ...restData } = data
    const modelData = {
      ...restData,
    }
    const updatedAt = now()

    const sql = `UPDATE ${tableName} 
    SET ${modelDataField} = $[modelData], ${relationIdField} = $[relationId], updated_at = $[updatedAt]
    WHERE ${modelIdField} = $[modelId] RETURNING ${modelIdField}`
    const params = {
      modelId,
      modelData,
      relationId,
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

module.exports = createModelWithRelation
