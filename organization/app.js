const express = require('express')
const app = express()
const {db_connection} = require('./database/db_index')
const orgApis = require('./api/orgApis')

app.use(express.json())
db_connection()
orgApis(app)


app.get('/',(req,res)=>{
    res.status(200).json({
        message:"Testing from organization!"
    })
})

app.listen(8002,()=>{
    console.log("connection to the server was establish from organization!")
})