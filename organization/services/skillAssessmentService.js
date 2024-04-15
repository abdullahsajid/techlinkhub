const SkillAssessment = require('../database/repository/skill-assessment')

class SkillAssessmentService {
    constructor(){
        this.skill = new SkillAssessment()
    }

    async setSkillType({st_type,user_id}){
        const skillType = await this.skill.createSkillType({st_type,user_id})
        return skillType
    }
}

module.exports = SkillAssessmentService