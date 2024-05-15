const db_connection = require('../connection')
const cloudinary = require('cloudinary')
//database operation
class OrgRepository{
    
    constructor(){
        if(!OrgRepository.instance){
            this.db = null
            this.establishConnection()
            OrgRepository.instance = this
        }
        return OrgRepository.instance
    }

    async establishConnection(){
        try{
            this.db = await db_connection()
            console.log("connection establish in repo!")
        }catch(err){
            throw err
        }
    }

    async createProfile({name,desc,email,industry,location,banner,avatar,website,userId,about}){
        try{
            let selectItem = {};
            if(name !== ''){
                selectItem.org_name = name
            }
            if(desc !== ''){
                selectItem.description = desc
            }
            if(email !== ''){
                selectItem.org_email = email
            }
            if(industry !== ''){
                selectItem.industry = industry
            }
            if(location !== ''){
                selectItem.location = location
            }
            if(website !== ''){
                selectItem.org_website = website
            }
            if(about !== ''){
                selectItem.about = about
            }
            if(banner !== null && banner !== ''){
                const tlhBanner = await cloudinary.v2.uploader.upload(banner,{
                    folder:'tlhbanner'
                })
                const profileBanner = tlhBanner.secure_url
                selectItem.banner_url = profileBanner
            }
            if(avatar !== null && avatar !== ''){
                const tlhavatar = await cloudinary.v2.uploader.upload(avatar,{
                    folder:'tlkavatar'
                })
                const profileAvatar = tlhavatar.secure_url
                selectItem.avatar_url = profileAvatar
            }
            const key = Object.keys(selectItem);
            const val = Object.values(selectItem);
            const setKeys = key.map((key) => `${key} = ?`).join(", ");

            const profile = await this.db.query(`INSERT INTO org_profile SET ${setKeys},user_id = ?`,[...val,userId])
            return profile[0]
        }catch(err){
            console.log(err);
        }
    }

    async getProfile({id}){
        const profile = await this.db.query(`
            SELECT
                op.id,op.org_name,op.description,op.org_email,op.industry,op.location,op.banner_url,op.avatar_url,op.org_website,op.about,op.createdAt,
                (SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id',osl.id,
                        'name',osl.social_name,
                        'link',osl.link
                            )
                        )
                FROM orgsociallinks AS osl
                WHERE op.user_id = osl.userLink_id 
                ) AS socialLinks
            FROM 
                org_profile AS op WHERE user_id = ?`,[id])
        return profile[0]
    }

    async getProfileBySearch({id}){
        const profile = await this.db.query(`
            SELECT
                op.id,op.org_name,op.description,op.org_email,op.industry,op.location,op.banner_url,op.avatar_url,op.org_website,op.about,op.createdAt,
                (SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id',osl.id,
                        'name',osl.social_name,
                        'link',osl.link
                            )
                        )
                FROM orgsociallinks AS osl
                WHERE op.user_id = osl.userLink_id 
                ) AS socialLinks
            FROM 
                org_profile AS op WHERE id = ?`,[id])
        return profile[0]
    }

    async getAllOrgProfile(){
        const profile = await this.db.query(`SELECT * FROM org_profile`)
        return profile[0]
    }

    async getJob({id}){
        const jobs = await this.db.query(`SELECT * FROM createjob WHERE cj_orgProId = ?`,[id])
        return jobs[0]
    }
    
    async post({content,userProfile,userId}){
        const candidatePost = await this.db.query(`INSERT INTO post (content,userProfile_id,user__id) VALUES (?,?,?)`,[content,userProfile,userId])
        return candidatePost[0]
    }

    async postComment({comment,postId,userId}){
        const comments = await this.db.query(`INSERT INTO comments (comment,IdPost,userComm_id) VALUES (?,?,?)`,[comment,postId,userId])
        return comments
    }

    async getComments({id}){
        const getComment = await this.db.query(`SELECT * FROM comments WHERE IdPost = ?`,[id])
        return getComment[0]
    }
    
    async postLike({postId,userId,data}){
        
        if(data == null && !data){
            const like = await this.db.query(`INSERT INTO org_post_likes (userPost_id,userOrgId) VALUES (?,?)`,[postId,userId])
            return like[0]
        }
        // const check = data.some(item => item.userOrgId === userId)
        // console.log("check: ",check)
        if(data?.userOrgId === userId){
            const like = await this.db.query(`DELETE FROM org_post_likes WHERE userPost_id =? AND userOrgId = ?`,[postId,userId])
            return like[0]
        }else{
            const like = await this.db.query(`INSERT INTO org_post_likes (userPost_id,userOrgId) VALUES (?,?)`,[postId,userId])
            return like[0]
        }
        // const like = await this.db.query(`INSERT INTO org_post_likes (userPost_id,userOrgId) VALUES (?,?)`,[postId,userId])
        // return like[0]
    }

    async getPostLikeById({id}){
        const like = await this.db.query(`SELECT * FROM org_post_likes WHERE userPost_id = ?`,[id])
        return like[0]
    }

    async postSocialLinks({name,link,profileId,userId}){
        const links = await this.db.query(`INSERT INTO orgsociallinks (social_name,link,userProf_id,userLink_id) VALUES (?,?,?,?)`,
        [name,link,profileId,userId])
        return links[0]
    }

    async postImg({img,postId,userId}){
        const tlhPostImg = await cloudinary.v2.uploader.upload(img,{
            folder:'tlhPost'
        })
        const publicId = tlhPostImg.public_id
        const secureId = tlhPostImg.secure_url
        const imgs = await this.db.query(`INSERT INTO postimg (public_id,url,postImg__id,postImgUser_id) VALUES (?,?,?,?)`,
        [publicId,secureId,postId,userId])
        return imgs[0]
    }

    async getPost({id}){
        const post = await this.db.query(`SELECT * FROM post WHERE userProfile_id = ?`,[id])
        return post[0]
    }

    async getPostById({id}){
        const post = await this.db.query(`SELECT * FROM post WHERE post_id = ?`,[id])
        return post[0]
    }

//     SELECT 
//     p.*,
//     (SELECT JSON_ARRAYAGG(
//                 JSON_OBJECT(
//                     'comment_id', c.comment_id,
//                     'comment', c.comment,
//                     'userId', c.userComm_id
//                 )
//             )
//     FROM comments c 
//     WHERE p.post_id = c.IdPost
//     ) AS comments,
//     COUNT(DISTINCT c.comment_id) AS comment_count,
//     COUNT(DISTINCT l.org_like_id) AS like_count
// FROM 
//     post p 
// LEFT JOIN 
//     comments c ON p.post_id = c.IdPost
// LEFT JOIN 
//     org_post_likes l ON p.post_id = l.userPost_id
// WHERE 
//     p.post_id = ?
// GROUP BY 
//     p.post_id
    async createJob({title,category,location,type,desc,resp,requirement,qual,skill,orgId,userId}){
        const job = await this.db.query(`INSERT INTO createjob (cj_title,cj_category,cj_location,cj_type,cj_description,cj_responsibility,cj_requirement,cj_qualification,cj_skills,cj_orgProId,cj_user_id) VALUES (?,?,?,?,?,?,?,?,?,?,?)`
        ,[title,category,location,type,desc,resp,requirement,qual,skill,orgId,userId])
        return job[0]
    }

    async updateProfile(data,updateData){
        let updateObject={}
        if(data.org_name !== updateData.name){
            updateObject.org_name = updateData.name
        }
        if(data.description !== updateData.desc){
            updateObject.description = updateData.desc
        }
        if(data.about !== updateData.about){
            updateObject.about = updateData.about
        }
        if(data.org_email !== updateData.email){
            updateObject.org_email = updateData.email
        }
        if(data.industry !== updateData.industry){
            updateObject.industry = updateData.industry
        }
        if(data.location !== updateData.location){
            updateObject.location = updateData.location
        }
        if(data.org_website !== updateData.website){
            updateObject.org_website = updateData.website
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
                const profileAvatar = tlhavatar.secure_url
                updateObject.avatar_url = profileAvatar
            }else{
                const extract_id = await data.avatar_url .split('/').pop().split('.')[0]
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
    
        const updateItems = await this.db.query(`UPDATE org_profile SET ${setKeys} WHERE id = ?`,[...values,data.id])
        return updateItems
    }

}

module.exports = OrgRepository



