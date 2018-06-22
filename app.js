require('dotenv').config()
const app = require('express')()
const port = process.env.PORT || 5001
const bodyParser = require('body-parser')
const NodeHTTPError = require('node-http-error')
const { propOr, isEmpty, compose, not, join, pathOr } = require('ramda')
const reqFieldChecker = require('./lib/required-field-check')
const {
  addBoard,
  updateBoard,
  deleteBoard,
  deleteBoardPromise,
  listBoards
} = require('./dal')

app.use(bodyParser.json())

app.get('/', function(req, res, next) {
  res.send('Welcome to the brocean, brah.  Gnar Gnar.')
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

  const sendMissingFieldError = compose(not, isEmpty)(missingFields)

  if (sendMissingFieldError) {
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

  addBoard(newBoard, function(err, result) {
    if (err)
      next(
        new NodeHTTPError(err.status, err.message, { ...err, max: 'isCool' })
      )
    res.status(201).send(result)
  })
})

app.put('/boards/:sku', function(req, res, next) {
  const updatedBoard = propOr({}, 'body', req)
  //console.log('updatedBoard', updatedBoard)

  if (isEmpty(updatedBoard)) {
    console.log('i dont have a board.')
    next(
      new NodeHTTPError(
        400,
        'Brah, add a board to the request body.  Ensure the Content-Type is application/json. Dude!'
      )
    )
  }

  const missingFields = reqFieldChecker(
    ['_id', '_rev', 'name', 'category', 'price', 'sku'],
    updatedBoard
  )

  const sendMissingFieldError = compose(not, isEmpty)(missingFields)

  if (sendMissingFieldError) {
    console.log('I have missing required fields. ')
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

  updateBoard(updatedBoard, function(err, result) {
    if (err) next(new NodeHTTPError(err.status, err.message))
    res.status(200).send(result)
  })
})

// app.delete('/boards/:sku', (req, res, next) =>
//   deleteBoard(
//     `board_${req.params.sku}`,
//     (err, deleteResult) =>
//       err
//         ? next(new NodeHTTPError(err.status, err.message, err))
//         : res.status(200).send(deleteResult)
//   )
// )

app.delete('/boards/:sku', (req, res, next) =>
  deleteBoardPromise(`board_${req.params.sku}`)
    .then(result => res.status(200).send(result))
    .catch(err => next(new NodeHTTPError(err.status, err.message, err)))
)

app.get('/boards', (req, res, next) => {
  const limit = Number(pathOr(10, ['query', 'limit'], req)) // "10" or 10

  // /boards?limit=2&start_key=board_22221

  // 1) do they want to paginate?
  const paginate = pathOr(null, ['query', 'start_key'], req)

  listBoards(limit, paginate)
    .then(boards => res.status(200).send(boards))
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
