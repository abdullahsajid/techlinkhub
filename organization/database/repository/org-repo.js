const db_connection = require('../connection')
// const cloudinary = require('cloudinary')
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

    async createProfile({name,desc,email,industry,location,banner,avatar,website,userId}){
        const profile = await this.db.query(`INSERT INTO org_profile (org_name,description,org_email,industry,location,banner_url,avatar_url,org_website,user_id) VALUES (?,?,?,?,?,?,?,?,?)`,
        [name,desc,email,industry,location,banner,avatar,website,userId])
        return profile[0]
    }

    async getProfile({id}){
        const profile = await this.db.query(`SELECT * FROM org_profile WHERE id = ?`,[id])
        return profile
    }

    async post({content,userProfile,userId}){
        const candidatePost = await this.db.query(`INSERT INTO post (content,userProfile_id,user_id) VALUES (?,?,?)`,[content,userProfile,userId])
        return candidatePost[0]
    }
}

module.exports = candidateRepository

