const candidateService = require('../services/org-service')
const auth = require('./middleware/auth')
module.exports = (app) => {
    const service = new candidateService()

    app.post('/createOrgProfile',auth,async(req,res)=>{
        const data = await service.profile({
            name:req.body.name,
            desc:req.body.Bio,
            email:req.body.Email,
            industry:req.body.industry,
            location:req.body.location,
            banner:req.body.banner,
            avatar:req.body.avatar,
            website:req.body.weblink,
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

    app.post('/postComment/:id',auth,async(req,res) => {
        const data = await service.userComment({
            comment:req.body.comment,
            postId:req.params.id,
            userId:req.user.id
        })
        res.status(201).json({data,message:"comment added!"})
    })

    app.post('/postLike/:id',auth, async (req,res) => {
        const data = await service.userLike({
            postId:req.params.id,
            userId:req.user.id
        })
        res.status(201).json({data,message:"post Like successfully!"})
    })

    app.post('/socialLinks/:id',auth,async (req,res) => {
        const data = await service.userSocial({
            name:req.body.name,
            link:req.body.link,
            profileId:req.params.id,
            userId:req.user.id
        })
        res.status(201).json({data,message:'socialLinks added successfully!'})
    })

    app.post('/postImg/:id',auth,async (req,res) => {
        const data = await service.userPostImg({
            img:req.body.img,
            postId:req.params.id,
            userId:req.user.id
        })
        res.status(201).json({data,message:'Post image added successfully!'})
    })

    app.get('/getPost/:id',auth,async (req,res) => {
        const data = await service.userGettingPost({id:req.params.id})
        res.status(201).json({data})
    })
}

