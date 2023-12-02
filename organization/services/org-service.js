const candidateRepository = require('../database/repository/org-repo')
const jwt = require('jsonwebtoken')

//business logic
class candidateService{
    constructor(){
        this.repository = new candidateRepository
    }

    async profile(profileData){
        const{name,desc,email,industry,location,banner,avatar,website,userId} = profileData
        const profileDetail = await this.repository.createProfile({name,desc,email,industry,location,banner,avatar,website,userId})
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

}

module.exports = candidateService
