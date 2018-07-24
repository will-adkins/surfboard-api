require('dotenv').config()
const PouchDB = require('pouchdb-core')
PouchDB.plugin(require('pouchdb-adapter-http'))
PouchDB.plugin(require('pouchdb-find'))

const db = new PouchDB(
  `${process.env.COUCH_HOSTNAME}${process.env.COUCH_DBNAME}`
)

const myFields = ['type', '_id', '_rev', 'name', 'category', 'price', 'sku']

db.createIndex({ index: { fields: ['category'] } }, function(err, result) {
  if (err) console.log('ERROR! ', JSON.stringify(err, null, 2))
  else console.log('SUCCESS! ', JSON.stringify(result, null, 2))
})

db.createIndex({ index: { fields: ['name'] } }, function(err, result) {
  if (err) console.log('ERROR! ', JSON.stringify(err, null, 2))
  else console.log('SUCCESS! ', JSON.stringify(result, null, 2))
})

db.createIndex({ index: { fields: ['price'] } }, function(err, result) {
  if (err) console.log('ERROR! ', JSON.stringify(err, null, 2))
  else console.log('SUCCESS! ', JSON.stringify(result, null, 2))
})

db.createIndex({ index: { fields: ['_id', 'type'] } }, function(err, result) {
  if (err) console.log('ERROR! ', JSON.stringify(err, null, 2))
  else console.log('SUCCESS! ', JSON.stringify(result, null, 2))
})
