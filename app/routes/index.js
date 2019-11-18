const router = require('express-promise-router')()

router.use('/files', require('./files'))
router.use('/courses', require('./courses'))
router.use('/subjects', require('./subjects'))

module.exports = router