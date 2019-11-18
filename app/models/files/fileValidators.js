const { checkSchema } = require('express-validator')
const { getValidator, getStringValidatorSchema, getIntValidatorSchema, setIsOptional } = require('../../helpers/validatorHelpers')

const schema = {
  filename: getStringValidatorSchema('Tiedostonimi'),
  fileType: getStringValidatorSchema('Tiedostotyyppi'),
  description: setIsOptional(getStringValidatorSchema('Kuvaus')),
  size: getIntValidatorSchema('Tiedostokoko'),
  courseId: setIsOptional(getIntValidatorSchema('Kurssi'))
}

const validateCreate = () =>
  getValidator([
    checkSchema(schema)
  ])

const validateUpdate = () =>
  getValidator([
    checkSchema({
      description: setIsOptional(getStringValidatorSchema('Kuvaus')),
      fileId: {
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
