const express = require('express')
const app = express()
const candidateApi = require('./api/candidateApi')
const {db_connection} = require('./database/db_index')

app.use(express.json())
db_connection()
candidateApi(app)
app.use('/',(req,res)=>{
    res.json({message:"listen from candidate sever!"})    
})


app.listen(8001, () => {
    console.log("Connection to server is working fine!")
})
