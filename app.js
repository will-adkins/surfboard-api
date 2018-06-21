require('dotenv').config()
const app = require('express')()
const port = process.env.PORT || 5001
const bodyParser = require('body-parser')
const NodeHTTPError = require('node-http-error')
const { propOr, isEmpty, compose, not, join } = require('ramda')
const reqFieldChecker = require('./lib/required-field-check')
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
