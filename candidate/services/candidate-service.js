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
        this.token = await jwt.sign(
            {email:email,id:userAdded.id},
            process.env.JWT_AUTH,
            {expiresIn:'24h'}
        )
        return userAdded
    }

    async login(userData){
        const {email,password} = userData
        const loginData = await this.repository.findUser({email,password})
        this.token = await jwt.sign(
            {email:email,id:loginData.id},
            process.env.JWT_AUTH,
            {expiresIn:'24h'}
        )
        return loginData
    }

    async getToken(){
        return this.token
    }

}

module.exports = candidateService
