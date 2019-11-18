
const router = require('express-promise-router')()

const { validateCreate, validateUpdate } = require('../models/subjects/subjectValidators')
const { decorate, decorateList } = require('../models/subjects/subjectDecorators')
const createSimpleModel = require('../helpers/createSimpleModel')

const model = createSimpleModel('subject')

router.get('/', (req, res) =>
  model.findAll(req.context.db, req.query)
    .then(decorateList)
    .then(result => res.send(result)))

router.get('/:subjectId', (req, res) =>
  res.send(decorate(req.context.resultRow)))

router.post('/', validateCreate(), (req, res) => {
  const newItem = {
    ...req.body
  }
  return model.save(req.context.db, newItem, req.user)
    .then(decorate)
    .then(result => res.status(201).send(result))
})

router.put('/:subjectId', validateUpdate(), (req, res) => {
  const toSave = { ...req.body }
  const oldItem = decorate(req.resultRow)

  return model.save(req.context.db, { ...oldItem, ...toSave }, req.user, req.params.subjectId)
    .then(decorate)
    .then(result => res.send(result))
})

router.delete('/:subjectId', (req, res) => {
  const { subjectId } = req.params
  return model.remove(req.context.db, subjectId)
    .then(() => res.status(204).send())
})

const findSubjectById = (req, _, next, value) =>
  model.findById(req.context.db, value)
    .then(resultRow => {
      req.context.resultRow = resultRow
      next()
    })

router.use('/:subjectId/courses', require('./courses'))
router.param('subjectId', findSubjectById)

module.exports = router
