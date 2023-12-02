const express = require('express')
const app = express()
const candidateApi = require('./api/candidateApi')
const {db_connection} = require('./database/db_index')
const cloudinary = require('cloudinary')

app.use(express.json())
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
