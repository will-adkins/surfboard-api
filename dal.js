require('dotenv').config()
const PouchDB = require('pouchdb-core')
PouchDB.plugin(require('pouchdb-adapter-http'))

const { merge, prop } = require('ramda')
const pkGen = require('./lib/pk-gen')

const db = new PouchDB(
  `${process.env.COUCH_HOSTNAME}${process.env.COUCH_DBNAME}`
)

const addBoard = (board, cb) => {
  const modifiedBoard = merge(board, {
    type: 'board',
    _id: pkGen('board_', '-', prop('sku', board))
  })
  db.put(modifiedBoard, cb)
}

const updateBoard = (board, cb) => db.put(board, cb)

module.exports = { addBoard }
