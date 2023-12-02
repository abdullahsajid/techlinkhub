const candidateRepository = require('../database/repository/candidate-repo')
const jwt = require('jsonwebtoken')

//business logic
class candidateService{
    constructor(){
        this.repository = new candidateRepository
        this.token = null
    }

    async signUp(userData){
        const {email,password,name} = userData
        const userAdded = await this.repository.createUser({email,password,name})
        if(userAdded && userAdded[0] && userAdded[0][0] && userAdded[0][0].id){
        let tokenId =  userAdded[0][0].id
        this.token = await jwt.sign(
            {email:email,id:tokenId},
            process.env.JWT_AUTH,
            {expiresIn:'24h'}
        )
        return userAdded}
    }

    async login(userData){
        const {email,password} = userData
        const loginData = await this.repository.findUser({email,password})
        if(loginData && loginData[0] && loginData[0][0] && loginData[0][0].id){
            let tokenId =  loginData[0][0].id
            this.token = await jwt.sign(
                {id:tokenId,email:email},
                process.env.JWT_AUTH,
                {expiresIn:'24h'}
            )
        return loginData}
    }

    async profile(profileData){
        const{name,bio,education,banner,avatar,experience,userId} = profileData
        const profileDetail = await this.repository.createProfile({name,bio,education,banner,avatar,experience,userId})
        return profileDetail
    }

    async skills({skill_name,userId}){
        const userSkills = await this.repository.addSkills({skill_name,userId})
        return userSkills
    }

    async socialLinks({name,link,userId}){
        const userLinks = await this.repository.addSocialLinks({name,link,userId})
        return userLinks
    }
    
    async profileDetails({id}){
        const profile = await this.repository.getProfile({id})
        return profile
    }

    async userPost({content,userProfile,userId}){
        const post = await this.repository.post({content,userProfile,userId})
        return post
    }

    async getToken(){
        return this.token
    }

}

module.exports = candidateService
