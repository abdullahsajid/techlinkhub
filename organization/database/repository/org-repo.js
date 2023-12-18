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

    async createProfile({name,desc,email,industry,location,banner,avatar,website,userId,about}){
        const tlhBanner = await cloudinary.v2.uploader.upload(banner,{
            folder:'tlhbanner'
        })
        const tlhavatar = await cloudinary.v2.uploader.upload(avatar,{
            folder:'tlkavatar'
        })
        const profileBanner = tlhBanner.secure_url
        const profileAvatar = tlhavatar.secure_url
        const profile = await this.db.query(`INSERT INTO org_profile (org_name,description,org_email,industry,location,banner_url,avatar_url,org_website,user_id,about) VALUES (?,?,?,?,?,?,?,?,?,?)`,
        [name,desc,email,industry,location,profileBanner,profileAvatar,website,userId,about])
        return profile[0]
    }

    async getProfile({id}){
        const profile = await this.db.query(`
            SELECT
                op.org_name,op.description,op.org_email,op.industry,op.location,op.banner_url,op.avatar_url,op.org_website,op.about,op.createdAt,
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
    
    async post({content,userProfile,userId}){
        const candidatePost = await this.db.query(`INSERT INTO post (content,userProfile_id,user__id) VALUES (?,?,?)`,[content,userProfile,userId])
        return candidatePost[0]
    }

    async postComment({comment,postId,userId}){
        const comments = await this.db.query(`INSERT INTO comments (comment,IdPost,userComm_id) VALUES (?,?,?)`,[comment,postId,userId])
        return comments
    }

    async postLike({postId,userId}){
        const like = await this.db.query(`INSERT INTO org_post_likes (userPost_id,userOrgId) VALUES (?,?)`,[postId,userId])
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
        const post = await this.db.query(`
        SELECT 
            p.*,
            (SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'comment_id', c.comment_id,
                            'comment', c.comment,
                            'userId', c.userComm_id
                        )
                    )
            FROM comments c 
            WHERE p.post_id = c.IdPost
            ) AS comments,
            COUNT(DISTINCT c.comment_id) AS comment_count,
            COUNT(DISTINCT l.org_like_id) AS like_count
        FROM 
            post p 
        LEFT JOIN 
            comments c ON p.post_id = c.IdPost
        LEFT JOIN 
            org_post_likes l ON p.post_id = l.userPost_id
        WHERE 
            p.post_id = ?
        GROUP BY 
            p.post_id
            `,[id])
        return post[0]
    }
}

module.exports = candidateRepository

// INNER JOIN
// org_post_likes opl ON p.post_id = opl.userPost_id
// ,COUNT(opl.userPost_id) AS like_count

