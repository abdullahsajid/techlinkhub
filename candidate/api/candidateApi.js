const candidateService = require('../services/candidate-service')
const auth = require('./middleware/auth')
module.exports = (app) => {
    const service = new candidateService()

    app.post('/signup', async (req,res,next) => {
        const [data] = await service.signUp({
            email:req.body.email,
            password:req.body.password,
            name:req.body.name
        })
        const token = await service.getToken()
        res.status(201).json({data:data[0],token})
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
    
    app.post('/createProfile',auth,async(req,res)=>{
        const data = await service.profile({
            name:req.body.name,
            bio:req.body.bio,
            about:req.body.about,
            education:req.body.education,
            banner:req.body.banner,
            avatar:req.body.avatar,
            experience:req.body.experience,
            userId:req.user.id
        })
        res.status(201).json({
            data:data,
            message:"successfully created!"
        })
    })

    app.post('/addSkills',auth,async(req,res)=>{
        const data = await service.skills({
            skill_name:req.body.skill,
            userId:req.user.id
        })
        res.status(201).json({
            data:data,
            message:'skill added successfully!'
        })
    })

    app.post('/addSocialLinks',auth,async(req,res) => {
        const data = await service.socialLinks({
            name:req.body.socialName,
            link:req.body.link,
            userId:req.user.id
        })
        res.status(201).json({
            data:data,
            message:'link added successfully!'
        })
    })

    app.get('/getProfile',auth, async (req,res) => {
        const data = await service.profileDetails({id:req.user.id})
        res.status(200).json({data:data[0]})
    })

    app.post('/candidatePost/:id',auth,async(req,res)=>{
        const data = await service.userPost({
            content:req.body.content,
            userProfile:req.params.id,
            userId:req.user.id
        })
        res.status(201).json({data,message:'post added successfully!'})
    })

    app.put('/updateProfile',auth,async(req,res) => {
        try{
            const id = req.user.id
            const data = await service.updateProfileDetails(id,
                {
                    name:req.body.name,
                    bio:req.body.bio,
                    about:req.body.about,
                    education:req.body.education,
                    banner:req.body.banner,
                    avatar:req.body.avatar,
                    experience:req.body.experience,
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

    app.get("/logout",(req,res) => {
        try{
            res.status(200)
            .cookie('token',null,
            {expires: new Date(Date.now()),httpOnly:true,sameSite:'None',secure:true})
            .json({
                success:true,
                message:"logout!"
            })
        }catch(err){
            res.status(500).json({success:false,message:err.message})
        }
    })

}