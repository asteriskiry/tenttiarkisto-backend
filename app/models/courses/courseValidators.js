const { checkSchema } = require('express-validator')
const { getValidator, getStringValidatorSchema, getIntValidatorSchema, setIsOptional } = require('../../helpers/validatorHelpers')

const schema = {
  name: getStringValidatorSchema('Nimi'),
  subjectId: getIntValidatorSchema('Pääaine')
}

const validateCreate = () =>
  getValidator([
    checkSchema(schema)
  ])

const validateUpdate = () =>
  getValidator([
    checkSchema({
      courseId: {
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
