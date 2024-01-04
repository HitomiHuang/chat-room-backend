if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const methodOverride = require('method-override')
const routes = require('./routes')
const socket = require('./socket')
const cors = require('cors')
const port = process.env.PORT || 3000
const http = require('http')
const app = express()
const server = http.createServer(app)
socket(server)

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))
app.use('/api', routes)

server.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app