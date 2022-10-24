const router = require('express').Router()
const logger = require('../config/logger')

const FirstPolicy = require('../policies/FirstPolicy')

/**
 * POST /v1/api/first-route
 * @summary My first route.
 * @tags ApiTag
 * @param {FirstPayload} request.body.required - log - application/json
 * @return 200 - Success response - application/json
 */
router.get('/', FirstPolicy.policy, (req, res) => {
    logger.info('First api route')
    res.status(200).send({
        hello: 'world',
    })
})

module.exports = router
