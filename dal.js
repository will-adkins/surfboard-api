require('dotenv').config()
const PouchDB = require('pouchdb-core')
PouchDB.plugin(require('pouchdb-adapter-http'))
PouchDB.plugin(require('pouchdb-find'))

const { merge, map, propOr, prop, split } = require('ramda')
const pkGen = require('./lib/pk-gen')

const db = new PouchDB(
  `${process.env.COUCH_HOSTNAME}${process.env.COUCH_DBNAME}`
)

const addBoard = board => {
  const modifiedBoard = merge(board, {
    type: 'board',
    _id: pkGen('board_', '-', prop('sku', board))
  })
  return db.put(modifiedBoard)
}

const replaceBoard = newBoard => db.put(newBoard)

const getBoard = sku => db.get(`board_${sku}`)

const deleteBoard = sku =>
  db.get(`board_${sku}`).then(result => db.remove(result))

const listBoards = (limit, paginate) => {
  return db
    .allDocs(
      paginate
        ? { include_docs: true, limit: limit, start_key: `${paginate}\ufff0` }
        : { include_docs: true, limit: limit, start_key: 'board_' }
    )
    .then(boards => map(prop('doc'), propOr([], 'rows', boards)))
}

const filterListBoards = (filterQueryStr, limitStr, paginate) => {
  const [filterKey, filterValue] = split(':', filterQueryStr)

  // const selector = paginate
  //   ? { _id: { $gt: `${paginate}\ufff0` }, [`${filterKey}`]: filterValue }
  //   : { _id: { $regex: 'board_' }, [`${filterKey}`]: filterValue }

  return db
    .find({
      selector: paginate
        ? { _id: { $gt: `${paginate}\ufff0` }, [`${filterKey}`]: filterValue }
        : { _id: { $regex: 'board_' }, [`${filterKey}`]: filterValue },
      limit: Number(limitStr)
    })
    .then(bookmark => bookmark.docs)
}

module.exports = {
  addBoard,
  replaceBoard,
  getBoard,
  deleteBoard,
  listBoards,
  filterListBoards
}
