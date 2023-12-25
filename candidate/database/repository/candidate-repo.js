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

    async createProfile({name,bio,about,education,banner,avatar,experience,userId}){
        const tlhBanner = await cloudinary.v2.uploader.upload(banner,{
            folder:'tlhbanner'
        })
        const tlhavatar = await cloudinary.v2.uploader.upload(avatar,{
            folder:'tlkavatar'
        })
        const profileBanner = tlhBanner.secure_url
        const profileAvatar = tlhavatar.secure_url
        const profileData = await this.db.query(`INSERT INTO profile (name,bio,about,education,banner_url,avatar_url,experience,user_id) VALUES (?,?,?,?,?,?,?,?)`,
        [name,bio,about,education,profileBanner,profileAvatar,experience,userId])
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
            p.id,p.banner_url,p.avatar_url,p.name,p.bio,p.education,p.experience,p.about,
            (SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', s.id,
                    'skill', s.skill_name
                        )
                    )
            FROM skills s 
            WHERE p.user_id = s.user_id
            ) AS skill,
            (SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', sl.id,
                    'socialName', sl.social_name,
                    'link',sl.link
                        )
                    )
            FROM socialLinks sl 
            WHERE p.user_id = sl.user_id
            ) AS socialLink,
            (SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id' , cp.post_id,
                    'content', cp.content,
                    'createdAt',cp.createdAt,
                    'postImg',cp.url,
                    'userId',cp.userPost_id
                        )
                    )
            FROM candidatepost cp
            WHERE p.user_id = cp.userPost_id
            ) AS candidatePosts
        FROM 
            profile p 
        WHERE 
            p.user_id = ?
        `,[id])
        return profile[0]
    }

    async post({content,url,userId}){
        const tlhPostImg = await cloudinary.v2.uploader.upload(url,{
            folder:'tlhPost'
        })
        const publicId = tlhPostImg.public_id
        const secureUrl = tlhPostImg.secure_url
        const candidatePost = await this.db.query(`INSERT INTO candidatepost (content,url,public_id,userPost_id) VALUES (?,?,?,?)`,[content,secureUrl,publicId,userId])
        return candidatePost[0]
    }

    async getProfiles(){
        const profiles = await this.db.query('SELECT * FROM profile')
        return profiles[0]
    }

    // async postImg({img,postId,userId}){
    //     const tlhPostImg = await cloudinary.v2.uploader.upload(img,{
    //         folder:'tlhPost'
    //     })
    //     const publicId = tlhPostImg.public_id
    //     const secureUrl = tlhPostImg.secure_url
    //     const imgs = await this.db.query(`INSERT INTO postimg (public_id,url,postImg__id,postImgUser_id) VALUES (?,?,?,?)`,
    //     [publicId,secureUrl,postId,userId])
    //     return imgs[0]
    // }

    async updateProfile(data,updateData){
        let updateObject={}
        if(data.name !== updateData.name){
            updateObject.name = updateData.name
        }
        if(data.bio !== updateData.bio){
            updateObject.bio = updateData.bio
        }
        if(data.about !== updateData.about){
            updateObject.about = updateData.about
        }
        if(data.education !== updateData.education){
            updateObject.education = updateData.education
        }
        if(data.experience !== updateData.experience){
            updateObject.experience = updateData.experience
        }
        if(data.banner_url !== updateData.banner){
            const extract_id = await data.banner_url.split('/').pop().split('.')[0]
            const  public_id = `tlhbanner/${extract_id}`
            await cloudinary.v2.uploader.destroy(public_id)
            const tlhBanner = await cloudinary.v2.uploader.upload(updateData.banner,{
                folder:'tlhbanner'
            })
            const profileBanner = tlhBanner.secure_url
            updateObject.banner_url = profileBanner
        }
        if(data.avatar_url !== updateData.avatar){
            const extract_id = await data.banner_url.split('/').pop().split('.')[0]
            const  public_id =  `tlkavatar/${extract_id}`
            await cloudinary.v2.uploader.destroy(public_id)
            const tlhavatar = await cloudinary.v2.uploader.upload(updateData.avatar,{
                folder:'tlkavatar'
            })
            const profileAvatar =  tlhavatar.secure_url
            updateObject.banner_url = profileAvatar
        }
        const key = Object.keys(updateObject)
        const values = Object.values(updateObject)
        const setKeys = key.map(key => `${key} = ?`).join(', ')
    
        const updateItems = await this.db.query(`UPDATE profile SET ${setKeys} WHERE id = ?`,[...values,data.id])
        return updateItems
    }
}

module.exports = candidateRepository



