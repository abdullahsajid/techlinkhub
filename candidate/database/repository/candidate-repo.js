const db_connection = require('../connection')

//database operation
class candidateRepository{
    
    constructor(){
        this.db = null
        this.establishConnection()
    }

    async establishConnection(){
        try{
            this.db = await db_connection()
            console.log("connection establish in repo!")
        }catch(err){
            throw err
        }
    }

    async createUser({email,password,name}){
        const userCredential = await this.db.query(`INSERT INTO signup (email,password,name) VALUES (?,?,?)`
        ,[email,password,name])

        return userCredential
    }

    async findUser({email,password}){
        const userData = await this.db.query(`SELECT * FROM signup WHERE email = ? && password = ?`
        ,[email,password])
        return userData
    }
}

module.exports = candidateRepository
