const orgRepo = require('./org-repo')

class Project {
    constructor(){
        this.proj = new orgRepo()
    }

    async createProject({title,description,budget,status,type,skills,user_id,org_id}){
        let selectItem={}
        if(title !== ''){
            selectItem.project_title = title
        }
        if(description !== ''){
            selectItem.project_description = description
        }
        if(budget !== ''){
            selectItem.project_budget = budget
        }
        if(status !== ''){
            selectItem.project_status = status
        }
        if(type !== ''){
            selectItem.project_type = type
        }
        if(skills !== ''){
            let getSkill = JSON.stringify(skills)
            selectItem.project_skills  = getSkill
        }
        if(org_id !== '' && org_id !== null && org_id !== undefined){ 
            selectItem.project_org_id = org_id
        }
        const key = Object.keys(selectItem)
        const value = Object.values(selectItem)
        const keys = key.map((key) => `${key} = ?`).join(', ')
        const project = await this.proj.db.query(`INSERT INTO projects SET ${keys}, user_id=?`,[...value,user_id])
        return project[0]
    }

    async getProjectById({id}){
        const project = await this.proj.db.query(`SELECT * FROM projects WHERE project_id = ?`,[id])
        return project[0]
    }

    async updateProject(data,updateData){
        let updateItem = {}
        if(data.project_title !== updateData.title){
            updateItem.project_title = updateData.title
        }
        if(data.project_description !== updateData.description){
            updateItem.project_description = updateData.description
        }
        if(data.project_budget !== updateData.budget){
            updateItem.project_budget = updateData.budget
        }
        if(data.project_status !== updateData.status){
            updateItem.project_status = updateData.status
        }
        if(data.project_type !== updateData.type){
            updateItem.project_type = updateData.type
        }
        if(data.project_skills !== updateData.skills){
            let getSkill = JSON.stringify(updateData.skills)
            updateItem.project_skills = getSkill
        }
        if(data.project_org_id !== updateData.org_id){
            updateItem.project_org_id = updateData.org_id
        }
        const key = Object.keys(updateItem)
        const value = Object.values(updateItem)
        const keys = key.map((key) => `${key} = ?`).join(', ')
        const updateProject = await this.proj.db.query(`UPDATE projects SET ${keys} WHERE project_id = ?`,[...value,data.project_id])
        return updateProject[0]
    }

    async deleteProject({id}){
        const project = await this.proj.db.query(`DELETE FROM projects WHERE project_id = ?`,[id])
        return project[0]
    }

    async summonAllProjects(user_id){
        const project = await this.proj.db.query(`SELECT * FROM projects WHERE user_id = ?`,[user_id])
        return project
    }

}



module.exports = Project
