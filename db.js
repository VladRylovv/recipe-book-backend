const pgp = require('pg-promise')()

const db = pgp(`postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.PORT_DB}/recipes`)

module.exports = db
