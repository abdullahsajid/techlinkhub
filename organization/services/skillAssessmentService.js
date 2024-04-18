const SkillAssessment = require("../database/repository/skill-assessment");

class SkillAssessmentService {
  constructor() {
    this.skill = new SkillAssessment();
  }

  async setSkillType({ st_type, user_id }) {
    const skillType = await this.skill.createSkillType({ st_type, user_id });
    return skillType;
  }

  async setQuestion(questionsData, user_id) {
    const questions = await this.skill.createQuestion(questionsData, user_id);
    return questions;
  }

  async calculateScore(optionPayload,skill_id,user_id) {
    let cal = 0;
    for (const items of optionPayload) {
      const getMcqs = await this.skill.getMcqsById(items.id);
      if (getMcqs.length > 0) {
        const { sq_id, sq_answer } = getMcqs[0];
        if (sq_id === items.id && sq_answer === items.answer) {
          cal = cal + 10;
        }
      } else {
        console.error(`Question with ID ${questionId} not found`);
      }
    }
    let badge = ''
    if(cal <= 0){
        badge = null
    }else if(cal > 0 && cal<=30){
        badge = 'Beginner'
    }else if (cal > 30 && cal <= 60){
        badge = 'Intermediate'
    }else if (cal > 60){
        badge = 'Expert'
    }
    const calData = await this.skill.calScore(cal,badge,skill_id,user_id);
    return calData;
  }

  async skillBaseMcqs(id){
    const data = await this.skill.getMcqs(id)
    return data
  }

  async retrieveSkillType(){
    const data = await this.skill.getSkillType();
    return data;
  }

  async retrieveBadge(){
    const data = await this.skill.getBadge();
    return data;
  }

}

module.exports = SkillAssessmentService;
