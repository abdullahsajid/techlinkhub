const projectService = require('../services/projectService')
const auth = require('./middleware/auth')

module.exports = (app) => {
    const projectServices = new projectService()

    app.post('/createProject',auth, async (req,res) => {
        try{
            const data = await projectServices.projects({
                title:req.body.title,
                description:req.body.description,
                budget:req.body.budget,
                status:req.body.status,
                type:req.body.type,
                skills:req.body.skills,
                user_id:req.user.id,
                org_id:req.body.org_id
            })
            res.status(201).json({
                data: data,
                message: 'Project created successfully!',
                success: true
            })
        }catch(err){
            res.status(500).json({message:err.message,success:false})
        }
    })

    app.put('/updateProject/:id',auth, async (req,res) => {
        try{
            const data = await projectServices.EditProject(req.params.id,req.body)
            res.status(200).json({
                data: data,
                message: 'Project updated successfully!'
            })
        }catch(err){
            res.status(500).json({message:err.message})
        }
    })

    app.delete('/deleteProject/:id',auth, async (req,res) => {
        try{
            const data = await projectServices.delProject(req.params.id)
            res.status(200).json({
                data: data,
                message: 'Project deleted successfully!'
            })
        }catch(err){
            res.status(500).json({message:err.message})
        }
    })

    app.get('/summonAllProjects',auth, async (req,res) => {
        try{
            const data = await projectServices.retrieveProject(req.user.id)
            res.status(200).json({
                data: data[0],
                message: 'Projects retrieved successfully!'
            })
        }catch(err){
            res.status(500).json({message:err.message})
        }
    })

    app.get('/summonProjectById/:id',auth, async (req,res) => {
        try{
            const data = await projectServices.retrieveProjectById(req.params.id)
            res.status(200).json({
                data: data[0],
                message: 'Project retrieved successfully!'
            })
        }catch(err){
            res.status(500).json({message:err.message})
        }
    })
} 
