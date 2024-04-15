const OrgRepository = require('../database/repository/org-repo')
const jwt = require('jsonwebtoken')

//business logic
class OrgService{
    constructor(){
        this.repository = new OrgRepository
    }

    async profile(profileData){
        const{name,desc,email,industry,location,banner,avatar,website,userId,about} = profileData
        const profileDetail = await this.repository.createProfile({name,desc,email,industry,location,banner,avatar,website,userId,about})
        return profileDetail
    }

    
    async profileDetails({id}){
        const profile = await this.repository.getProfile({id})
        return profile
    }

    async userPost({content,userProfile,userId}){
        const post = await this.repository.post({content,userProfile,userId})
        return post
    }

    async userComment({comment,postId,userId}){
        const comments = await this.repository.postComment({comment,postId,userId})
        return comments
    }

    async userLike({postId,userId}){
        const userLike = await this.repository.postLike({postId,userId})
        return userLike
    }

    async userSocial({name,link,profileId,userId}){
        const links = await this.repository.postSocialLinks({name,link,profileId,userId})
        return links
    }

    async userPostImg({img,postId,userId}){
        const postImg = await this.repository.postImg({img,postId,userId})
        return postImg
    }

    async userGettingPost({id}){
        const getPost = await this.repository.getPost({id})
        return getPost
    }

    async userCreateJob({title,category,location,type,desc,resp,requirement,qual,skill,orgId,userId}){
        const job = await this.repository.createJob({title,category,location,type,desc,resp,requirement,qual,skill,orgId,userId})
        return job
    }

    async updateProfileDetails(id,updateData){
        const profile = await this.repository.getProfile({id})
        const data = profile[0]
        const updateProfile = await this.repository.updateProfile(data,updateData)
        return updateProfile
    }
}

module.exports = OrgService
