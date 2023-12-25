const express = require('express')
const cors = require('cors')
const proxy = require('express-http-proxy')
const cookieParser = require('cookie-parser')
const app = express()

const corsOptions = {
    origin:['http://localhost:3000'], 
    credentials:true,        
    optionSuccessStatus:200,
    methods:["GET","POST","PUT","DELETE"]
}
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(express.json({limit:'50mb'}))
app.use(express.urlencoded({limit:'50mb', extended:true }))

app.use('/candidate',proxy('http://localhost:8001/'))
app.use('/organization',proxy('http://localhost:8002/'))

app.listen(8000,() => {
    console.log("Main server is running!")
})

