const OrgRepository = require("./org-repo");

class SkillAssessment {
  constructor() {
    this.org = new OrgRepository();
  }

  async createSkillType({st_type, user_id}) {
    const skill_type = await this.org.db.query(
      `
            INSERT INTO skill_type (st_type,user_id) VALUES (?,?)`,
      [st_type, user_id]
    );
    return skill_type[0];
  }
}

module.exports = SkillAssessment;
