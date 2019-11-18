const { validationResult, matchedData } = require('express-validator')
const pick = require('lodash/pick')
const createError = require('http-errors')
const moment = require('moment')

const getError = (validationErrors) =>
  createError(400, 'Validation error', { data: validationErrors })

const checkValidationResult = (req, res, next) => {
  const result = validationResult(req)
  if(result.isEmpty()) {
    return next()
  } else {
    return next(getError(result.array()))
  }
}

const getFieldFilter = (target = 'body', __schema) => (req, res, next) => {
  req._alreadyMatchedKeys = req._alreadyMatchedKeys || []
  const matchedKeys = Object.keys(matchedData(req, { locations: ['body'], includeOptionals: true })).filter(key => !req._alreadyMatchedKeys.includes(key))
  req._alreadyMatchedKeys.push(...matchedKeys)
  req[target] = pick(req.body, matchedKeys)
  next()
}

const getValidator = (validatorChain, clearErrors) => {
  return [
    ...validatorChain,
    checkValidationResult,
    getFieldFilter(clearErrors)
  ]
}

const getStringValidatorSchema = name => ({
  in: ['body'],
  isString: {
    errorMessage: `${name} pitää olla tekstimuodossa`
  },
  trim: true,
  isLength: {
    errorMessage: `${name} puuttuu`,
    options: { min: 1 }
  }
})

const getIntValidatorSchema = name => ({
  in: ['body'],
  isInt: true,
  toInt: true,
  errorMessage: `${name} puuttuu tai on vääräntyyppinen`
})

const getDecimalPositiveValidatorSchema = name => ({
  in: ['body'],
  isFloat: {
    options: { min: 0 },
    errorMessage: `${name} pitää olla positiivinen tai se puuttuu tai on vääräntyyppinen`
  },
  toFloat: true,
  errorMessage: `${name} puuttuu tai on vääräntyyppinen`
})

const getDecimalValidatorSchema = name => ({
  in: ['body'],
  isDecimal: {
    errorMessage: `${name} pitää olla desimaalinumero`
  },
  toFloat: true,
  errorMessage: `${name} puuttuu`
})

const getDateTimeValidatorSchema = name => ({
  in: ['body'],
  custom: {
    options: value => value && moment(value, moment.ISO_8601).isValid(),
    errorMessage: `${name} ei ole päivämäärämuodossa`
  },
  customSanitizer: {
    options: value => moment(value).format()
  }
})

const getDateValidatorSchema = name => ({
  in: ['body'],
  custom: {
    options: value => value && moment(value, moment.ISO_8601).isValid(),
    errorMessage: `${name} ei ole päivämäärämuodossa`
  },
  customSanitizer: {
    options: value => moment(value).format('YYYY-MM-DD')
  }
})

const getArrayValidator = name => ({
  in: ['body'],
  isArray: {
    errorMessage: `${name} pitää olla taulukko`
  },
  errorMessage: `${name} puuttuu`
})

const getCustomArrayValidator = (name, itemValidator, minLength = 0) => ({
  in: ['body'],
  isArray: {
    errorMessage: `${name} pitää olla taulukko`
  },
  errorMessage: `${name} puuttuu`,
  custom: {
    options: array => {
      if(array.length < minLength) {
        throw new Error(`${name} ei voi olla tyhjä`)
      }
      const isValid = array.every(itemValidator)
      if(!isValid) {
        throw new Error(`${name} sisältää viallisia arvoja`)
      }
      return isValid
    }
  }
})

const getBooleanValidatorSchema = name => ({
  in: ['body'],
  isBoolean: {
    errorMessage: `${name} pitää olla true/false`
  },
  toBoolean: true,
  errorMessage: `${name} puuttuu`
})

const setIsOptional = validatorSchema => ({
  ...validatorSchema,
  optional: {
    options: {
      nullable: true,
      defined: true
    }
  }
})

const withParamIdValidatorSchema = (fieldName, validatorSchema) => ({
  ...validatorSchema,
  [fieldName]: {
    in: ['params'],
    isInt: true,
    toInt: true
  }
})

module.exports = {
  getValidator,
  getFieldFilter,
  checkValidationResult,
  getError,
  getStringValidatorSchema,
  getIntValidatorSchema,
  getDecimalPositiveValidatorSchema,
  getDecimalValidatorSchema,

  getArrayValidator,
  getCustomArrayValidator,

  getDateTimeValidatorSchema,
  getDateValidatorSchema,

  setIsOptional,
  getBooleanValidatorSchema,
  withParamIdValidatorSchema,
}
