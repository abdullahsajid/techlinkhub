const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const app = express()
const cloudinary = require('cloudinary')
const {db_connection} = require('./database/db_index')
const orgApis = require('./api/orgApis')
const AssessmentApis = require('./api/AssessmentApis')
const projectApis = require("./api/projectApis")

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

db_connection()
orgApis(app)
AssessmentApis(app)
projectApis(app)
app.get('/',(req,res)=>{
    res.status(200).json({
        message:"Testing from organization!"
    })
})

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

app.listen(8002,()=>{
    console.log("connection to the server was establish from organization!")
})

