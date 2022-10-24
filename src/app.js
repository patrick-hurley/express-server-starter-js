// Express
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const morgan = require('morgan')

// Enable dotenv
require('dotenv').config()

const { sequelize } = require('./models')
const path = require('path')
const history = require('connect-history-api-fallback')
const frameguard = require('frameguard')

// Swagger
const expressJSDocSwagger = require('express-jsdoc-swagger')
const swaggerOptions = require('./config/swaggerOptions')

// Logging
const logger = require('./config/logger')
require('pretty-error').start()
const colors = require('colors')
colors.enable()

/* 
-------------------------------
Express setup
-------------------------------
*/
const app = express()

app.use(bodyParser.json())

app.use(cookieParser())

app.use(cors())

/* Clickjacking prevention */
app.use(function (req, res, next) {
    res.header('Content-Security-Policy', "frame-ancestors 'none'")

    next()
})
app.use(frameguard({ action: 'deny' }))

// http logging
if (process.env.HOSTING_ENV !== 'development') {
    app.use(morgan('combined'))
} else {
    const morganChalk = morgan(function (tokens, req, res) {
        return [
            tokens.method(req, res),
            tokens.status(req, res),
            tokens.url(req, res),
            tokens['response-time'](req, res) + ' ms',
        ].join(' ').gray
    })
    app.use(morganChalk)
}

/* 
-------------------------------
Swagger
-------------------------------
*/

if (process.env.HOSTING_ENV === 'development') {
    expressJSDocSwagger(app)(swaggerOptions)
}

/* 
-------------------------------
Routes
-------------------------------
*/

app.use('/v1/api/', require('./routes'))

/*
-------------------------------
Production settings
-------------------------------
*/
if (process.env.HOSTING_ENV !== 'development') {
    app.use((req, res, next) => {
        if (req.header('x-forwarded-proto') !== 'https') {
            res.redirect(`https://${req.header('host')}${req.url}`)
        } else {
            next()
        }
    })
    app.use(history())
    app.use(express.static(path.join(__dirname, '../../client/dist')))
}

/*
-------------------------------
Error handler
-------------------------------
*/
app.use(async (error, req, res, next) => {
    const errorPayload = {
        status: error.status,
        url: req.url,
        message: error.message,
        stack: error.err ? error.err.stack : null,
        stackMessage: error.err ? error.err.message : null,
    }

    logger.error(errorPayload)

    if (!res.headersSent) {
        res.status(500).send({
            error: error.message,
        })
    }

    return next()
})

process.on('warning', (e) => logger.warn(e.stack))

/*
-------------------------------
Start server
-------------------------------
*/
sequelize
    .sync()
    .then(() => {
        app.listen(process.env.PORT, async () => {
            console.log(
                '\n\n🐠 ' + `Server started on port: ${process.env.PORT}`.bold
            )
            console.log('🌵 ' + `Environment: ${process.env.HOSTING_ENV}`.bold)
            console.log(
                '📪 ' +
                    `Email sending: ${
                        parseInt(process.env.SEND_EMAIL) ? 'on' : 'off'
                    }\n\n`.bold
            )
        })
    })
    .catch((err) => {
        console.log(err)
    })
