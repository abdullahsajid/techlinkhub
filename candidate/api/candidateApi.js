const candidateService = require('../services/candidate-service')
const auth = require('./middleware/auth')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

module.exports = (app) => {
    const service = new candidateService()

    app.post("/create-checkout-session", async (req, res) => {
        try {
            const session = await stripe.checkout.sessions.create({
              payment_method_types: ["card"],
              mode: "payment",
              line_items: req.body.items.map(item => {
               
                return {
                  price_data: {
                    currency: "usd",
                    product_data: {
                      name: item.name,
                    },
                    unit_amount: item.price*100,
                  },
                  quantity: item.quantity,
                }
              }),
              success_url: `http://localhost:3000/home`,
              cancel_url: `http://localhost:3000/home`,
            })
            res.json({ url: session.url })
          } catch (e) {
            res.status(500).json({ error: e.message })
          }
    })

    app.post('/signup', async (req,res,next) => {
        const data = await service.signUp({
            email:req.body.email,
            password:req.body.password,
            name:req.body.name
        })
        const token = await service.getToken()

        if(data?.success === false){
            return res.status(200).json({
                data:data,message:"credential Wrong!"
            })
        }else{
            return res.status(201).json({data:data,token})
        }
    })

    app.post('/login',async (req,res) => {
        const data = await service.login({
            email:req.body.email,
            password:req.body.password
        })
        const token = await service.getToken()
        if(data?.success === false){
            return res.status(200).json(
                {data:data,message:"credential Wrong!"}
            )
        }else{
            return res.status(200).json(
                {data:data,token,message:"login successfully!"}
            )
        }
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

    app.post('/candidatePost',auth,async(req,res)=>{
        try{
            const data = await service.userPost({
                content:req.body.content,
                url:req.body.url,
                userId:req.user.id
            })
            res.status(201).json({data,message:'post added successfully!'})
        }catch(err){
            res.status(500).json({message:err.message})
        }
    })  

    app.get('/getUserProfiles',auth,async(req,res) => {
        try{
            const data = await service.userProfiles()
            res.status(201).json({success:true,data:data})
        }catch(err){
            res.status(500).json({success:false,message:err.message})
        }
    })

    app.post('/postComment/:id',auth,async(req,res) => {
        const data = await service.userComment({
            comment:req.body.comment,
            postId:req.params.id,
            userId:req.user.id
        })
        res.status(201).json({data,message:"comment added!"})
    })

    app.get('/getComments/:id', auth, async (req,res)=>{
        try{
            const id = req.params.id
            const data = await service.getUserComments({id})
            res.status(201).json({success:true,data:data[0]})
        }catch(err){
            res.status(500).json({success:false,message:err.message})
        }  
    })

    app.get('/postLike/:id',auth, async (req,res) => {
        try {
            const data = await service.userLike({
                postId:req.params.id,
                userId:req.user.id
            })
            res.status(201).json({success:true,data,message:"post Like successfully!"})
        } catch (error) {
            res.status(500).json({success:false,message:err.message})
        }
    })

    app.get('/getlikes/:id', auth, async (req,res)=>{
        try{
            const id = req.params.id
            const data = await service.getUserLikes({id})
            res.status(201).json({success:true,data:data[0]})
        }catch(err){
            res.status(500).json({success:false,message:err.message})
        }  
    })

    app.get('/getLoginUserPost',auth,async (req,res) => {
        try{
            const id = req.user.id
            const data = await service.getLoginUserPost({id})
            res.status(201).json({success:true,data:data[0]})
        }catch(err){
            res.status(500).json({success:false,message:err.message})
        }
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

    app.get('/getProfileById/:id',auth,async(req,res) => {
        try{
            const id = req.params.id
            const data = await service.retrieveProfileById({id})
            res.status(200).json({data:data[0]})
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