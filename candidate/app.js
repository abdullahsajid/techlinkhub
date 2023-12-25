const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const app = express()
const candidateApi = require('./api/candidateApi')
const {db_connection} = require('./database/db_index')
const cloudinary = require('cloudinary')

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
candidateApi(app)

app.use('/',(req,res)=>{
    res.json({message:"listen from candidate sever!"})    
})

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

app.listen(8001, () => {
    console.log("Connection to server is working fine!")
})






