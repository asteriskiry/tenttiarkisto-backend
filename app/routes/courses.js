
const router = require('express-promise-router')({ mergeParams: true })

const { validateCreate, validateUpdate } = require('../models/courses/courseValidators')
const { decorate, decorateList } = require('../models/courses/courseDecorators')
const createModelWithRelation = require('../helpers/createModelWithRelation')

const model = createModelWithRelation('course', 'subject')

router.get('/', (req, res) =>
  model.findAll(req.context.db, req.params.subjectId, req.query)
    .then(decorateList)
    .then(result => res.send(result)))

router.get('/:courseId', (req, res) =>
  res.send(decorate(req.context.resultRow)))

router.post('/', validateCreate(), (req, res) => {
  const newItem = {
    ...req.body
  }
  return model.save(req.context.db, newItem, req.user)
    .then(decorate)
    .then(result => res.status(201).send(result))
})

router.put('/:courseId', validateUpdate(), (req, res) => {
  const toSave = { ...req.body }
  const oldItem = decorate(req.resultRow)

  return model.save(req.context.db, { ...oldItem, ...toSave }, req.user, req.params.courseId)
    .then(decorate)
    .then(result => res.send(result))
})

router.delete('/:courseId', (req, res) => {
  const { courseId } = req.params
  return model.remove(req.context.db, courseId)
    .then(() => res.status(204).send())
})

const findCourseById = (req, _, next, value) =>
  model.findById(req.context.db, value)
    .then(resultRow => {
      req.context.resultRow = resultRow
      next()
    })

router.use('/:courseId/files', require('./files'))
router.param('courseId', findCourseById)

module.exports = router
