require('dotenv').config()
const PouchDB = require('pouchdb-core')
PouchDB.plugin(require('pouchdb-adapter-http'))

const db = new PouchDB(
  `${process.env.COUCH_HOSTNAME}${process.env.COUCH_DBNAME}`
)

const surfboards = [
  {
    _id: 'board_12345',
    name: 'shred',
    category: 'fish',
    price: 399.99,
    sku: '12345',
    type: 'board'
  },
  {
    _id: 'board_8888',
    _rev: '1-1ca5cd4cfd54e940dade391ba71e3158',
    name: 'shred dlux',
    category: 'fish',
    price: 488.88,
    sku: '8888',
    type: 'board'
  },
  {
    _id: 'board_58748',
    name: 'brah',
    category: 'longboard',
    price: 499.99,
    sku: '58748',
    type: 'board'
  },
  {
    _id: 'board_34532',
    name: 'dude brah',
    category: 'longboard',
    price: 499.99,
    sku: '34532',
    type: 'board'
  }
]

db.bulkDocs(surfboards, function(err, result) {
  if (err) {
    console.log('ERROR', JSON.stringify(err))
    return
  }

  console.log('SUCCESS!', JSON.stringify(result, null, 2))
})
