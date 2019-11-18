const { checkSchema } = require('express-validator')
const { getValidator, getStringValidatorSchema, getIntValidatorSchema, setIsOptional } = require('../../helpers/validatorHelpers')

const schema = {
  name: getStringValidatorSchema('Nimi')
}

const validateCreate = () =>
  getValidator([
    checkSchema(schema)
  ])

const validateUpdate = () =>
  getValidator([
    checkSchema({
      subjectId: {
        in: ['params'],
        isInt: true,
        toInt: true
      }
    })
  ])

module.exports = {
  validateCreate,
  validateUpdate
}
