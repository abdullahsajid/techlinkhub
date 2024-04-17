const OrgRepository = require("./org-repo");

class SkillAssessment {
  constructor() {
    this.org = new OrgRepository();
  }

  async createSkillType({ st_type, user_id }) {
    const skill_type = await this.org.db.query(
      `INSERT INTO skill_type (st_type,user_id) VALUES (?,?)`,
      [st_type, user_id]
    );
    let id = skill_type[0].insertId;
    if(skill_type[0].insertId){
      const getData = await this.org.db.query(
        `SELECT * FROM skill_type WHERE st_id = ?`,[id])
      return getData[0];
    }
  }

  async createQuestion(questionsData, user_id) {
    const insertedQuestions = [];
    for (const questionData of questionsData) {
      const { question, options, answer, skill_id } = questionData;
      const optionsJSON = JSON.stringify(options);
      const insertedQuestion = await this.org.db.query(
        `INSERT INTO skillquestions (sq_question, sq_options, sq_answer, user_id, skill_id) VALUES (?, ?, ?, ?, ?)`,
        [question, optionsJSON, answer, user_id, skill_id]
      );
      insertedQuestions.push(insertedQuestion[0]);
    }
    return insertedQuestions;
  }

  async getMcqsById(id) {
    const data = await this.org.db.query(
      `SELECT * FROM skillquestions WHERE sq_id = ?`,
      [id]
    );
    return data[0];
  }

  async calScore(cal, badge, skill_id, user_id) {
    const query = await this.org.db.query(
      `INSERT INTO scores (score,badge,skillType,user_id) VALUES (?,?,?,?)`,
      [cal, badge, skill_id, user_id]
    );
    return query[0];
  }

  async getMcqs(id) {
    const getData = await this.org.db.query(
      `
    SELECT 
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'st_id', st.st_id,
            'skill', st.st_type
          )
        ) AS skillType,
        (SELECT JSON_ARRAYAGG(
          JSON_OBJECT(
            'sqId',sq.sq_id,
            'question',sq.sq_question,
            'options',sq.sq_options
            )
          )
          FROM skillquestions sq
          WHERE st.st_id = sq.skill_id
        ) AS mcqsQues
    FROM
      skill_type st
    WHERE
      st.st_id = ?
    `,
      [id]
    );
    return getData[0];
  }
}

module.exports = SkillAssessment;
