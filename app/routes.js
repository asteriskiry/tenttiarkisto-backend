const router = require('express-promise-router')()

router.get('/files', (req, res) => 
  res.send({message: '/api/files/ route works'})
)

module.exports = router
