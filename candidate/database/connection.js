const mysql = require("mysql2/promise")
const dotenv = require('dotenv')
dotenv.config()

module.exports = async () => {
    let db
    try{
        const DB_NAME = "candidate"
        db = await mysql.createPool({
            host:process.env.DB_HOST,
            user:process.env.DB_USER,
            password:process.env.DB_PASS, 
            database:process.env.DB_NAME  
        })

        const con = await db.getConnection()
        const db_create = await db.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`)
        
        console.log("Connection successfully!")

        if(db_create && db_create[0] && db_create[0].affectedRows>0){
            console.log("DB created successfully!")
        }
        return db

    }catch(err){
        console.log("Error on DB",err)
        if(db){
            await db.end()
        }
        throw err
    }
}





