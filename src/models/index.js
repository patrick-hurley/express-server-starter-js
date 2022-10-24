const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const env = process.env.NODE_ENV
const config = require('../config/config')[env]
const db = {}

const colors = require('sequelize-log-syntax-colors')
config.logging = colors

let sequelize
if (env !== 'development') {
    sequelize = new Sequelize(config.database, {
        dialect: config.dialect,
        host: config.host,
        logging: false,
    })
} else {
    sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        {
            host: config.host,
            dialect: config.dialect,
            logging: false,
        }
    )
}

// read all model files in the current directory and sets them up with sequelize (other than index.js)
fs.readdirSync(__dirname)
    .filter((file) => file !== 'index.js')
    // load the models into sequelize
    .forEach((file) => {
        const model = require(path.join(__dirname, file))(
            sequelize,
            Sequelize.DataTypes
        )
        db[model.name] = model
    })

// Sequelize
db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
