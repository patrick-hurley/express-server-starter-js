const logger = require('../config/logger')
const transport = require('../config/transport')
const ServerErrorEmail = require('../email-templates/serverError')

module.exports = {
    reject: function (error, res, stack = null, httpCode = 400) {
        let message

        if (Array.isArray(error.details)) {
            message = error.details.map((error) => {
                return error.message
            })
        } else {
            message = error
        }

        if (stack) {
            logger.error(stack)
        } else {
            logger.info(error)
        }

        res.status(httpCode).send({
            error: message,
        })
    },
    notify: async function (error) {
        if (parseInt(process.env.SEND_EMAIL)) {
            const message = {
                from: 'Webmaster <hello@webmaster.com>',
                to: process.env.ADMIN_EMAIL,
                subject: 'Server error notification.',
                html: ServerErrorEmail(error),
            }
            await transport.sendMail(message)
        }
    },
}
