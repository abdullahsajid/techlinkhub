const express = require('express')
const app = express()

app.get('/',(req,res)=>{
    res.status(200).json({
        message:"Testing from organization!"
    })
})

app.listen(8002,()=>{
    console.log("connection to the server was establish from organization!")
})