const Joi = require('Joi')
const ErrorUtility = require('../utility/ErrorUtility')
const MiscUtility = require('../utility/MiscUtility')

module.exports = {
    policy(req, res, next) {
        try {
            req.body = MiscUtility.trimAndNullObjectProperties(req.body)

            const schema = Joi.object({
                foo: Joi.string().required(),
                bar: Joi.string().required(),
            }).required()

            const { error } = schema.validate(req.body, {
                abortEarly: false,
            })

            if (error) {
                ErrorUtility.reject(error, res)
                return
            }

            next()
        } catch (err) {
            ErrorUtility.reject('Validation failure', res, err)
        }
    },
}
