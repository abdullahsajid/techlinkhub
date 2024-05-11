const OrgService = require('../services/org-service')
const auth = require('./middleware/auth')
const project = require('../database/repository/project')
module.exports = (app) => {
    const service = new OrgService()
    //const projects = new project()
    //projects.createProject({title:'hello',description:'hello',budget:'hello',status:'hello',type:'hello',skills:{item:'asd',item:'dasd'}})
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
            userId:req.user.id,
            about:req.body.about
        })
        res.status(201).json({
            data:data,
            message:"successfully created!"
        })
    })

    app.get('/getProfile',auth, async (req,res) => {
        const data = await service.profileDetails({id:req.user.id})
        res.status(200).json({data:data[0]})
    })

    app.get('/getallProfile',auth,async(req,res)=>{
        try{
            const data = await service.allProfileDetails()
            res.status(201).json({data,message:'org profile',success:true})
        }catch(error){
            res.status(500).json({message:error.message,success:false})
        }
    })

    app.post('/orgPost/:id',auth,async(req,res)=>{
        try{
            const data = await service.userPost({
                content:req.body.content,
                userProfile:req.params.id,
                userId:req.user.id
            })
            res.status(201).json({data,message:'post added successfully!',success:true})
        }catch(error){
            res.status(500).json({message:error.message,success:false})
        }
    })

    app.post('/postComment/:id',auth,async(req,res) => {
        const data = await service.userComment({
            comment:req.body.comment,
            postId:req.params.id,
            userId:req.user.id
        })
        res.status(201).json({data,message:"comment added!",success:true})
    })

    app.get('/getCommentByid/:id',auth,async(req,res) => {
        try{
            const data = await service.summonCommentsById({
                id:req.params.id
            })
            res.status(201).json({data,message:"retrieve comments"})
        }catch(err){
            res.status(500).json({message:err})
        }
    })
    
    app.get('/getLikeByid/:id',auth,async(req,res) => {
        try{
            const data = await service.summonLikeById({
                id:req.params.id
            })
            res.status(201).json({data,message:"retrieve likes"})
        }catch(err){
            res.status(500).json({message:err})
        }
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

    app.get('/getPostByid/:id',auth,async(req,res) => {
        try{
            const data = await service.summonPostById({
                id:req.params.id
            })
            res.status(201).json({data,message:"retrieve posts"})
        }catch(err){
            res.status(500).json({message:err})
        }
    })


    app.post('/createJob/:id',auth, async (req,res) => {
        try{
            const data = await service.userCreateJob({
                title:req.body.title,
                category:req.body.category,
                location:req.body.location,
                type:req.body.type,
                desc:req.body.desc,
                resp:req.body.resp,
                requirement:req.body.requirement,
                qual:req.body.qual,
                skill:JSON.stringify(req.body.skill),
                orgId:req.params.id,
                userId:req.user.id
            })
            res.status(201).json({message:"successfully created!",data:data,success:true})
        }catch(err){
            res.status(500).json({message:err.message,success:false})
        }
    })

    app.get('/getJob/:id',auth,async (req,res) => {
        try{
            const data = await service.getJobs({id:req.params.id})
            res.status(201).json({data:data,success:true})
        }catch(error){
            res.status(500).json({success:false,message:error})
        }
    })

    app.put('/updateProfile',auth,async(req,res) => {
        try{
            const id = req.user.id
            const data = await service.updateProfileDetails(id,
                {
                    name:req.body.name,
                    desc:req.body.Bio,
                    email:req.body.Email,
                    industry:req.body.industry,
                    location:req.body.location,
                    banner:req.body.banner,
                    avatar:req.body.avatar,
                    website:req.body.weblink,
                    about:req.body.about
                }
            )
            res.status(200).json({data,
                message:'successfully updated!',
                success:true
            })
        }catch(err){
            res.status(500).json({message:err.message})
        }
    })

}

