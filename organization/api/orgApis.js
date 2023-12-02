const candidateService = require('../services/org-service')
const auth = require('./middleware/auth')
module.exports = (app) => {
    const service = new candidateService()

    app.post('/createOrgProfile',auth,async(req,res)=>{
        const data = await service.profile({
            name:req.body.name,
            desc:req.body.desc,
            email:req.body.email,
            industry:req.body.industry,
            location:req.body.location,
            banner:req.body.banner,
            avatar:req.body.avatar,
            website:req.body.website,
            userId:req.user.id
        })
        res.status(201).json({
            data:data,
            message:"successfully created!"
        })
    })

    app.get('/getProfile',auth, async (req,res) => {
        const data = await service.profileDetails({id:req.user.id})
        res.status(200).json({data})
    })

    app.post('/orgPost/:id',auth,async(req,res)=>{
        const data = await service.userPost({
            content:req.body.content,
            userProfile:req.params.id,
            userId:req.user.id
        })
        res.status(201).json({data,message:'post added successfully!'})
    })
}