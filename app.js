require('dotenv').config()
const app = require('express')()
const port = process.env.PORT || 5001
const bodyParser = require('body-parser')
const NodeHTTPError = require('node-http-error')
const {
  propOr,
  isEmpty,
  compose,
  not,
  join,
  pick,
  pathOr,
  split
} = require('ramda')
const reqFieldChecker = require('./lib/required-field-check')
const {
  addBoard,
  replaceBoard,
  getBoard,
  deleteBoard,
  listBoards,
  filterListBoards
} = require('./dal')

app.use(bodyParser.json())

app.get('/', function(req, res, next) {
  res.send('Welcome to the brocean, brah.  Gnar Gnar.')
})

app.get('/boards', function(req, res, next) {
  const limit = Number(pathOr(100, ['query', 'limit'], req))
  const paginate = pathOr(null, ['query', 'start_key'], req)
  const filterQuery = pathOr('type:board', ['query', 'filter'], req)

  // listBoards(limit, paginate)
  //   .then(list => res.status(200).send(list))
  //   .catch(err => next(new NodeHTTPError(err.status, err.message, err)))

  filterListBoards(filterQuery, limit, paginate)
    .then(list => res.status(200).send(list))
    .catch(err => next(new NodeHTTPError(err.status, err.message, err)))
})

app.get('/boards/:sku', function(req, res, next) {
  const sku = pathOr('', ['params', 'sku'], req)

  getBoard(sku)
    .then(board => res.status(200).send(board))
    .catch(err => next(new NodeHTTPError(err.status, err.message, err)))
})

app.put('/boards/:sku', function(req, res, next) {
  const newBoard = propOr({}, 'body', req)

  if (isEmpty(newBoard)) {
    next(
      new NodeHTTPError(
        400,
        'Brah, add a board to the request body.  Ensure the Content-Type is application/json. Dude!'
      )
    )
  }

  const missingFields = reqFieldChecker(
    ['type', '_id', '_rev', 'name', 'category', 'price', 'sku'],
    newBoard
  )
  const missingFieldError = compose(
    not,
    isEmpty
  )(missingFields)

  if (missingFieldError) {
    next(
      new NodeHTTPError(
        400,
        `Brah, you didnt pass all the required fields: ${join(
          ', ',
          missingFields
        )}`,
        { josh: 'is Cool and humble', jp: 'is Cool' }
      )
    )
  }

  const cleanBoard = pick(
    ['type', '_id', '_rev', 'name', 'category', 'price', 'sku'],
    newBoard
  )

  replaceBoard(cleanBoard)
    .then(replaceResult => res.status(200).send(replaceResult))
    .catch(err => next(new NodeHTTPError(err.status, err.message, err)))
})

app.post('/boards', (req, res, next) => {
  const newBoard = propOr({}, 'body', req)

  if (isEmpty(newBoard)) {
    next(
      new NodeHTTPError(
        400,
        'Brah, add a board to the request body.  Ensure the Content-Type is application/json. Dude!'
      )
    )
  }

  const missingFields = reqFieldChecker(
    ['name', 'category', 'price', 'sku'],
    newBoard
  )

  const sendMissingFieldError = compose(
    not,
    isEmpty
  )(missingFields)

  if (sendMissingFieldError) {
    next(
      new NodeHTTPError(
        400,
        `Brah, you didnt pass all the required fields: ${join(
          ', ',
          missingFields
        )}`
      )
    )
  }

  const cleanBoard = pick(['name', 'category', 'price', 'sku'], newBoard)

  addBoard(cleanBoard)
    .then(result => res.status(201).send(result))
    .catch(err =>
      next(
        new NodeHTTPError(err.status, err.message, { ...err, max: 'isCool' })
      )
    )
})

app.delete('/boards/:sku', function(req, res, next) {
  const sku = pathOr('', ['params', 'sku'], req)

  deleteBoard(sku)
    .then(deleteResult => res.status(200).send(deleteResult))
    .catch(err => next(new NodeHTTPError(err.status, err.message, err)))
})

app.use((err, req, res, next) => {
  console.log(
    `WIPEOUT! \n\nMETHOD ${req.method} \nPATH ${req.path}\n${JSON.stringify(
      err,
      null,
      2
    )}`
  )
  res.status(err.status || 500).send(err)
})

app.listen(port, () => console.log('Brah!', port))
