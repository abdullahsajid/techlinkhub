const express = require('express')
const cors = require('cors')
const proxy = require('express-http-proxy')
const app = express()
app.use(cors())

app.use('/candidate',proxy('http://localhost:8001/'))
app.use('/organization',proxy('http://localhost:8002/'))

app.listen(8000,() => {
    console.log("Main server is running!")
})
