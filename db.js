const pgp = require('pg-promise')()

const db = pgp(`postgres://${process.env.DB_USER}:${process.env.PASSWORD}@localhost:${process.env.PORT_DB}/recipes`)

module.exports = db
