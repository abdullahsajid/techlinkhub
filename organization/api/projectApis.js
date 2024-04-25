const projectService = require('../services/projectService')
const auth = require('./middleware/auth')

module.exports = (app) => {
    const projectServices = new projectService()

    app.post('/createProject',auth, async (req,res) => {
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
            message: 'Project created successfully!'
        })
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
} 
