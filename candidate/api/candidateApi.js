const candidateService = require('../services/candidate-service')

module.exports = (app) => {
    const service = new candidateService()
    app.post('/signup', async (req,res,next) => {
        const [data] = await service.signUp({
            email:req.body.email,
            password:req.body.password,
            name:req.body.name
        })
        const token = await service.getToken()
        res.status(201).json({data:data.insertId,token})
    })

    app.post('/login',async (req,res) => {
        const [data] = await service.login({
            email:req.body.email,
            password:req.body.password
        })
        const token = await service.getToken()
        res.status(200).json(
            {data:data[0],token,message:"login successfully!"}
        )
    })
}