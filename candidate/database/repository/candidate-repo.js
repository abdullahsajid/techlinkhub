const db_connection = require('../connection')
const cloudinary = require('cloudinary')
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

    async createProfile({name,bio,education,banner,avatar,experience,userId}){
        const tlhBanner = await cloudinary.v2.uploader.upload(banner,{
            folder:'tlhbanner'
        })
        const tlhavatar = await cloudinary.v2.uploader.upload(avatar,{
            folder:'tlkavatar'
        })
        const profileBanner = tlhBanner.secure_url
        const profileAvatar = tlhavatar.secure_url
        const profileData = await this.db.query(`INSERT INTO profile (name,bio,education,banner_url,avatar_url,experience,user_id) VALUES (?,?,?,?,?,?,?)`,
        [name,bio,education,profileBanner,profileAvatar,experience,userId])
        return profileData
    }

    async addSkills({skill_name,userId}){
        const s_name = await this.db.query(`INSERT INTO skills (skill_name,user_id) VALUES (?,?)`,[skill_name,userId])
        return s_name
    }

    async addSocialLinks({name,link,userId}){
        const linksData = await this.db.query(`INSERT INTO sociallinks (social_name,link,user_id) VALUES (?,?,?)`
        ,[name,link,userId])
        return linksData
    }

    async getProfile({id}){
        const profile = await this.db.query(`
        SELECT 
            p.id,p.banner_url,p.avatar_url,p.name,p.bio,p.education,p.experience
            ,s.skill_name,sl.social_name,sl.link
        FROM 
            profile p 
        LEFT JOIN 
            skills s ON p.user_id = s.user_id
        LEFT JOIN 
            socialLinks sl ON p.user_id = sl.user_id
        WHERE 
            p.user_id = ?`,[id])
        
        // const profileDetail = {
        //     id:profile[0].id,
        //     banner:profile[0].banner_url,
        //     avatar:profile[0].avatar_url,
        //     name:profile[0].name,
        //     bio:profile[0].bio,
        //     education:profile[0].education,
        //     experience:profile[0].experience,
        //     createdAt:profile[0].createdAt,
        //     updatedAt:profile[0].updatedAt,
        //     skills:[],
        //     socialLinks:[]
        // }
        // profile.forEach(data => {
        //     if(data.skill_name){
        //         profileDetail.skills.push({
        //             skill_name:data.skill_name
        //         })
        //     }
        //     if(data.social_name && data.link){
        //         profileDetail.socialLinks.push({
        //             social_name:data.social_name,
        //             link:data.link
        //         })
        //     }
        // })
        return profile[0]
    }

    async post({content,userProfile,userId}){
        const candidatePost = await this.db.query(`INSERT INTO candidatepost (content,userProfile_id,user_id) VALUES (?,?,?)`,[content,userProfile,userId])
        return candidatePost[0]
    }
}

module.exports = candidateRepository

