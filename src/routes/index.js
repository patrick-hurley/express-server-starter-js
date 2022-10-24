const router = require('express').Router()

router.use('/first-route', require('./FirstRoute'))

module.exports = router
