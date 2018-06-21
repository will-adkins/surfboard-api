require('dotenv').config()
const app = require('express')()
const port = process.env.PORT || 5001

const bodyParser = require('body-parser')
const NodeHTTPError = require('node-http-error')

app.use(bodyParser.json())

app.get('/', function(req, res, next) {
  res.send('Welcome to the brocean, brah.  Gnar Gnar.')
})

app.use((err, req, res, next) => {
  console.log(
    `WIPEOUT! \n\nMETHOD ${req.method} \nPATH ${req.path}\n${JSON.stringify(
      err,
      null,
      2
    )}`
  )
  res.status(err.status || 500).send(err.message)
})

app.listen(port, () => console.log('Brah!', port))
