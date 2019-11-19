
const router = require('express-promise-router')({ mergeParams: true })

const { validateCreate, validateUpdate } = require('../models/files/fileValidators')
const { decorate, decorateList } = require('../models/files/fileDecorators')
const createModelWithRelation = require('../helpers/createModelWithRelation')

const model = createModelWithRelation('file', 'course')

router.get('/', (req, res) =>
  model.findAll(req.context.db, req.params.courseId, req.query)
    .then(decorateList)
    .then(result => res.send(result)))

router.get('/:fileId', (req, res) => 
  res.send(decorate(req.context.resultRow)))


router.post('/', validateCreate(), (req, res) => {
  const newItem = {
    courseId: req.params.courseId,
    ...req.body
  }
  return model.save(req.context.db, newItem, req.user)
    .then(decorate)
    .then(result => res.status(201).send(result))
})

router.put('/:fileId', validateUpdate(), (req, res) => {
  const toSave = { ...req.body }
  const oldItem = decorate(req.resultRow)

  return model.save(req.context.db, { ...oldItem, ...toSave }, req.user, req.params.fileId)
    .then(decorate)
    .then(result => res.send(result))
})

router.delete('/:fileId', (req, res) => {
  const { fileId } = req.params
  return model.remove(req.context.db, fileId)
    .then(() => res.status(204).send())
})

const findFileById = (req, _, next, value) =>
  model.findById(req.context.db, value)
    .then(resultRow => {
      req.context.resultRow = resultRow
      next()
    })

router.param('fileId', findFileById)

module.exports = router