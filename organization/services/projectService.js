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

    async delProject(id){
        const deleteProject = await this.project.deleteProject({id})
        return deleteProject
    }

    async retrieveProject(id){
        const project = await this.project.summonAllProjects(id)
        return project
    }

    async retrieveProjectById(id){
        const project = await this.project.getProjectById({id})
        return project
    }
}

module.exports = ProjectService