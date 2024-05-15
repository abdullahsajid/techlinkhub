const db_connection = require('../connection')
const cloudinary = require('cloudinary')
//database operation
class CandidateRepository{
    
    constructor(){
        if(!CandidateRepository.instance){
            this.db = null
            this.establishConnection()
            CandidateRepository.instance = this
        }
        return CandidateRepository.instance
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
        const messageName = {message:"Name already taken!",success:false}
        const messageEmail = {message:"email already exist!",success:false}
        const checkUser = await this.db.query(`SELECT * FROM signup WHERE name = ?`,[name])
        if(checkUser[0]?.length === 0){
            const validateEmail = await this.db.query(`SELECT * FROM signup WHERE email = ?`,[email])
            if(validateEmail[0].length === 0){
                const userCredential = await this.db.query(`INSERT INTO signup (email,password,name) VALUES (?,?,?)`
                ,[email,password,name])
                return userCredential
            }else if(validateEmail[0][0]?.email === email){
                return messageEmail
            }
        }
        else if(checkUser[0][0]?.name === name){
            return messageName
        } 
    }

    async findUser({email,password}){
        const message = {message:"invalid email",success:false}
        const messagepass = {message:"incorrect password!",success:false}
        const validateEmail = await this.db.query(`SELECT * FROM signup WHERE email = ?`,[email])
        if(!validateEmail[0][0]?.email){
            return message
        }else if(validateEmail[0][0]?.email === email){
            const validatePass = await this.db.query(`SELECT * FROM signup WHERE email = ? && password = ?`,[email,password])
            if(!validatePass[0][0]?.password){
                return messagepass
            }else if(validatePass[0][0]?.password === password){
                return validatePass
            }
        }
        
    }

    async createProfile({name,bio,about,education,banner,avatar,experience,userId}){
        try{
            let selectItem = {};
            if(name !== ''){
                selectItem.name = name
            }
            if(bio !== ''){
                selectItem.bio = bio
            }
            if(about !== ''){
                selectItem.about = about
            }
            if(education !== ''){
                selectItem.education = education
            }
            if(experience !== ''){
                selectItem.education = education
            }
            if(banner !== null && banner !== ''){
                const tlhBanner = await cloudinary.v2.uploader.upload(banner,{
                    folder:'tlhbanner'
                })
                const profileBanner = tlhBanner.secure_url
                selectItem.banner_url = profileBanner
            }
            if(avatar !== null && avatar !== ''){
                console.log("Avatar");
                const tlhavatar = await cloudinary.v2.uploader.upload(avatar,{
                    folder:'tlkavatar'
                })
                const profileAvatar = tlhavatar.secure_url
                selectItem.avatar_url = profileAvatar
            }
            const key = Object.keys(selectItem);
            const val = Object.values(selectItem);
            const setKeys = key.map((key) => `${key} = ?`).join(", ");
            const profileData = await this.db.query(`INSERT INTO profile SET ${setKeys},user_id = ?`,[...val,userId])
            return profileData

        }catch(err){
            console.log(err);
        }
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
                    'userId',cp.userPost_id,
                    "comments",(SELECT JSON_ARRAYAGG(
                                JSON_OBJECT(
                                    'id', c.comment_id,
                                    'comment', c.comment,
                                    'postId',c.IdPost,
                                    "userId",c.userComm_id,
                                    'createdAt',c.createdAt
                                        )
                                    )
                            FROM comments c 
                            WHERE c.IdPost = cp.post_id
                            ),
                    "likes",(SELECT JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'id',candLike.id,
                                'PostId',candLike.userPost_id,
                                'userId',candLike.usercandId
                                    )    
                                )
                            FROM candidate_post_likes candLike
                            WHERE candLike.userPost_id = cp.post_id
                            )      
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

    async getProfileBySearch({id}){
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
                    'userId',cp.userPost_id,
                    "comments",(SELECT JSON_ARRAYAGG(
                                JSON_OBJECT(
                                    'id', c.comment_id,
                                    'comment', c.comment,
                                    'postId',c.IdPost,
                                    "userId",c.userComm_id,
                                    'createdAt',c.createdAt
                                        )
                                    )
                            FROM comments c 
                            WHERE c.IdPost = cp.post_id
                            ),
                    "likes",(SELECT JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'id',candLike.id,
                                'PostId',candLike.userPost_id,
                                'userId',candLike.usercandId
                                    )    
                                )
                            FROM candidate_post_likes candLike
                            WHERE candLike.userPost_id = cp.post_id
                            )      
                        )
                    )
            FROM candidatepost cp
            WHERE p.user_id = cp.userPost_id
            ) AS candidatePosts
        FROM 
            profile p 
        WHERE 
            p.id = ?
        `,[id])
        return profile[0]
    }

    async Search({para}){
        const search = await this.db.query(`(
            SELECT 'org_profile' AS source_table,id,avatar_url,org_name,description
            FROM organization.org_profile
            WHERE org_name LIKE ? OR description LIKE ?
            LIMIT 3
          )
          UNION
          (
            SELECT 'profile' AS source_table,id AS userID,avatar_url AS avatar,name AS pro_name,bio AS pro_bio
            FROM profile
            WHERE name LIKE ? OR bio LIKE ?
            LIMIT 3
          )`,[`%${para}%`,`%${para}%`,`%${para}%`,`%${para}%`])
        return search[0]
    }

    async SearchAcc({para}){
        const search = await this.db.query(`(
            SELECT 'org_profile' AS source_table,id,avatar_url,org_name,description
            FROM organization.org_profile
            WHERE org_name LIKE ? OR description LIKE ? 
            
          )
          UNION
          (
            SELECT 'profile' AS source_table,id AS userID,avatar_url AS avatar,name AS pro_name,bio AS pro_bio
            FROM profile
            WHERE name LIKE ? OR bio LIKE ?
            
          )`,[`${para}%`,`%${para}`,`%${para}%`,`${para}%`])
        return search[0]
    }
    

    async post({content,url,userId}){
        if(url == null && !url){
            const candidatePost = await this.db.query(`INSERT INTO candidatepost (content,userPost_id) VALUES (?,?)`,[content,userId])
            return candidatePost[0]
        }
        const tlhPostImg = await cloudinary.v2.uploader.upload(url,{
            folder:'tlhPost'
        })
        const publicId = tlhPostImg.public_id
        const secureUrl = tlhPostImg.secure_url
        const candidatePost = await this.db.query(`INSERT INTO candidatepost (content,url,public_id,userPost_id) VALUES (?,?,?,?)`,[content,secureUrl,publicId,userId])
        return candidatePost[0]
    }

    async postComment({comment,postId,userId}){
        const comments = await this.db.query(`INSERT INTO comments (comment,IdPost,userComm_id) VALUES (?,?,?)`,[comment,postId,userId])
        return comments
    }

    async getProfiles(){
        const profiles = await this.db.query('SELECT * FROM profile')
        return profiles[0]
    }

    async getComments({id}){
        const comment = await this.db.query(`
            SELECT 
                (SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', c.comment_id,
                        'comment', c.comment,
                        'postId',c.IdPost,
                        "userId",c.userComm_id,
                        'createdAt',c.createdAt
                            )
                        )
                FROM comments c 
                WHERE c.IdPost = ?
                ) AS comments
            `,[id])
        return comment[0]
    }

    async getAllComments(){
        const comment = await this.db.query(`SELECT * FROM comments`)
        return comment
    }

    async getLikes({id}){
        const likes = await this.db.query(`
            SELECT 
                (SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', candLike.id,
                        'postId', candLike.userPost_id,
                        'userId',candLike.usercandId
                            )
                        )
                FROM candidate_post_likes candLike 
                WHERE candLike.userPost_id = ?
                ) AS candLike
            `,[id])
        return likes[0]
    }

    async postLike({postId,userId,data}){
        // let usercandId = userId
        // console.log("userId",userId)
        // console.log("user",data.candLike)
        if(data.candLike == null && !data.candLike){
            const like = await this.db.query(`INSERT INTO candidate_post_likes (userPost_id,usercandId) VALUES (?,?)`,[postId,userId])
            return like[0]
        }
        const check = data.candLike.some(item => item.userId === userId)
        // console.log("check: ",check)
        if(check){
            const like = await this.db.query(`DELETE FROM candidate_post_likes WHERE userPost_id =? AND usercandId = ?`,[postId,userId])
            return like[0]
        }else{
            const like = await this.db.query(`INSERT INTO candidate_post_likes (userPost_id,usercandId) VALUES (?,?)`,[postId,userId])
            return like[0]
        }
    }


    async getUserPost({id}){
        const post = await this.db.query(`
            SELECT
                (SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id' , cp.post_id,
                        'content', cp.content,
                        'createdAt',cp.createdAt,
                        'postImg',cp.url,
                        'userId',cp.userPost_id,
                        "comments",(SELECT JSON_ARRAYAGG(
                                    JSON_OBJECT(
                                        'id', c.comment_id,
                                        'comment', c.comment,
                                        'postId',c.IdPost,
                                        "userId",c.userComm_id,
                                        'createdAt',c.createdAt
                                            )
                                        )
                                FROM comments c 
                                WHERE c.IdPost = cp.post_id
                                ),
                        "likes",(SELECT JSON_ARRAYAGG(
                                JSON_OBJECT(
                                    'id',candLike.id,
                                    'PostId',candLike.userPost_id,
                                    'userId',candLike.usercandId
                                        )    
                                    )
                                FROM candidate_post_likes candLike
                                WHERE candLike.userPost_id = cp.post_id
                                )      
                            )
                        )
                FROM candidatepost cp
                WHERE cp.userPost_id = ?
                ) AS loginUserPosts
        `,[id])
        return post[0]
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
    
    async getProfileById({id}){
        const profile = await this.db.query(`SELECT * FROM profile WHERE user_id = ?`,[id])
        return profile[0]
    }

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
            if(data.banner_url === null){
                const tlhBanner = await cloudinary.v2.uploader.upload(updateData.banner,{
                    folder:'tlhbanner'
                })
                const profileBanner = tlhBanner.secure_url
                updateObject.banner_url = profileBanner
            }else{
                const extract_id = await data.banner_url.split('/').pop().split('.')[0]
                const  public_id = `tlhbanner/${extract_id}`
                await cloudinary.v2.uploader.destroy(public_id)
                const tlhBanner = await cloudinary.v2.uploader.upload(updateData.banner,{
                    folder:'tlhbanner'
                })
                const profileBanner = tlhBanner.secure_url
                updateObject.banner_url = profileBanner
            }
        }
        if(data.avatar_url !== updateData.avatar){
            if(data.avatar_url === null){
                const tlhavatar = await cloudinary.v2.uploader.upload(updateData.avatar,{
                    folder:'tlkavatar'
                })
                const profileAvatar =  tlhavatar.secure_url
                updateObject.avatar_url = profileAvatar
            }else{
                const extract_id = await data.avatar_url.split('/').pop().split('.')[0]
                const  public_id =  `tlkavatar/${extract_id}`
                await cloudinary.v2.uploader.destroy(public_id)
                const tlhavatar = await cloudinary.v2.uploader.upload(updateData.avatar,{
                    folder:'tlkavatar'
                })
                const profileAvatar =  tlhavatar.secure_url
                updateObject.avatar_url = profileAvatar
            }
        }
        const key = Object.keys(updateObject)
        const values = Object.values(updateObject)
        const setKeys = key.map(key => `${key} = ?`).join(', ') 
        
    
        const updateItems = await this.db.query(`UPDATE profile SET ${setKeys} WHERE id = ?`,[...values,data.id])
        return updateItems
    }
}

module.exports = CandidateRepository



