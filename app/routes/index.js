const router = require('express-promise-router')()

router.use('/files', require('./files'))

module.exports = router