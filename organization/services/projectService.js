const projectRepo = require('../database/repository/project')

class ProjectService {
    constructor(){
        this.project = new projectRepo()
    }

    async projects({title,description,budget,status,type,skills,user_id,org_id}){
        const data = await this.project.createProject({title,description,budget,status,type,skills,user_id,org_id})
        return data
    }

    async EditProject(id,updateData){
        const data = await this.project.getProjectById({id})
        let summon = data[0]
        const updateProject = await this.project.updateProject(summon,updateData)
        return updateProject
    }
}

module.exports = ProjectService