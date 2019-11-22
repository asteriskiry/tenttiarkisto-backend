
const router = require('express-promise-router')({ mergeParams: true })
const { validateCreate, validateUpdate } = require('../models/files/fileValidators')
const { decorate, decorateList } = require('../models/files/fileDecorators')
const createModelWithRelation = require('../helpers/createModelWithRelation')
const { createPresignedS3URL, generateFileS3Keys, generateS3Data } = require('../helpers/awsHelpers')

const model = createModelWithRelation('file', 'course')


router.get('/', (req, res) =>
  model.findAll(req.context.db, req.params.courseId, req.query)
    .then(decorateList)
    .then(result => res.send(result)))

router.get('/:fileId', (req, res) =>
  Promise.resolve(decorate(req.context.resultRow))
    .then(createPresignedS3URL)
    .then(s3Url => res.redirect(302, s3Url)))

router.post('/', validateCreate(), (req, res) => {
  const fileData = {
    ...req.body,
    ...generateFileS3Keys(),
    courseId: req.params.courseId
  }
  return model.save(req.context.db, fileData, req.user)
    .then(decorate)
    .then(generateS3Data)
    .then(fileWithS3Data => res.status(201).send(fileWithS3Data))
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
