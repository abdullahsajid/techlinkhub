const CandidateRepository = require("./candidate-repo");
const cloudinary = require("cloudinary");

class Resume {
  constructor() {
    this.candidate = new CandidateRepository();
  }

  async createResume({ name, description, title, img, candidateId }) {
    const tlhavatar = await cloudinary.v2.uploader.upload(img, {
      folder: "tlkavatar",
    });
    const profileAvatar = tlhavatar.secure_url;
    const resume = await this.candidate.db.query(
      `INSERT INTO resume (name,description,title,img,cand_user_id) VALUES(?,?,?,?,?)`,
      [name, description, title, profileAvatar, candidateId]
    );
    return resume;
  }

  async updateResume(data, updateData) {
    let updateOj = {};
    if (data.name !== updateData.name) {
      updateOj.name = updateData.name;
    }
    if (data.description !== updateData.description) {
      updateOj.description = updateData.description;
    }
    if (data.title !== updateData.title) {
      updateOj.title = updateData.title;
    }
    if (data.img !== updateData.img) {
      const extract_id = await data.img.split("/").pop().split(".")[0];
      const public_id = `tlkavatar/${extract_id}`;
      await cloudinary.v2.uploader.destroy(public_id);
      const tlhavatar = await cloudinary.v2.uploader.upload(updateData.img, {
        folder: "tlkavatar",
      });
      updateOj.img = tlhavatar.secure_url;
    }
    const key = Object.keys(updateOj);
    const val = Object.values(updateOj);
    const setKeys = key.map((key) => `${key} = ?`).join(", ");

    const update = await this.candidate.db.query(
      `UPDATE resume SET ${setKeys} WHERE id = ?`,
      [...val, data.id]
    );
    return update;
  }

  async getResumeHeader({ id }) {
    const getHeader = await this.candidate.db.query(
      `
      SELECT * FROM resume WHERE cand_user_id = ?
    `,
      [id]
    );
    return getHeader[0];
  }

  async createResumeEdu({
    program_name,
    institution_name,
    start_date,
    end_date,
    description,
    resume_id,
    user_id,
  }) {
    const resumeEdu = await this.candidate.db.query(
      `INSERT INTO resume_edu (program_name,institution_name,start_date,end_date,description,resume_id,user_id) VALUES(?,?,?,?,?,?,?)`,
      [
        program_name,
        institution_name,
        start_date,
        end_date,
        description,
        resume_id,
        user_id,
      ]
    );
    return resumeEdu;
  }

  async getResumeEdu({ id }) {
    const getEdu = await this.candidate.db.query(
      `
      SELECT * FROM resume_edu WHERE user_id = ?
    `,
      [id]
    );
    return getEdu[0];
  }

  async getResumeEduFindById({ id }) {
    const getResumeEduById = await this.candidate.db.query(
      `SELECT * FROM resume_edu WHERE res_edu_id = ?`,[id]
    )
    return getResumeEduById[0]
  }

  async updateEdu(data, updateData) {
    let updateOjt = {};
    if (data.program_name !== updateData.program_name) {
      updateOjt.program_name = updateData.program_name;
    }
    if (data.institution_name !== updateData.institution_name) {
      updateOjt.institution_name = updateData.institution_name;
    }
    if (data.start_date !== updateData.start_date) {
      updateOjt.start_date = updateData.start_date;
    }
    if (data.end_date !== updateData.end_date) {
      updateOjt.end_date = updateData.end_date;
    }
    if (data.description !== updateData.description) {
      updateOjt.description = updateData.description;
    }
    const key = Object.keys(updateOjt);
    const val = Object.values(updateOjt);
    const setKeys = key.map((key) => `${key} = ?`).join(", ");

    const updateEdu = await this.candidate.db.query(
      `UPDATE resume_edu SET ${setKeys} WHERE res_edu_id = ?`,
      [...val, data.res_edu_id]
    );
    return updateEdu;
  }

  async deleteEdu({id}) {
    const deleteEdu = await this.candidate.db.query(
      `DELETE FROM resume_edu WHERE res_edu_id = ?`,
      [id]
    );
    return deleteEdu;
  }

  async createResumeExp({
    job_title,
    company_name,
    start_date,
    end_date,
    description,
    job_type,
    resume_id,
    user_id,
  }) {
    const resumeExp = await this.candidate.db.query(
      `
      INSERT INTO resume_exp (job_title,company_name,start_date,end_date,description,job_type,resume_id,user_id) VALUES(?,?,?,?,?,?,?,?)`,
      [
        job_title,
        company_name,
        start_date,
        end_date,
        description,
        job_type,
        resume_id,
        user_id,
      ]
    );
    return resumeExp;
  }

  async getResumeExp({ id }) {
    const getExp = await this.candidate.db.query(
      `SELECT * FROM resume_exp WHERE user_id = ?`,
      [id]
    );
    return getExp[0];
  }

  async getResumeExpFindById({ id }) {
    const getResumeExpById = await this.candidate.db.query(
      `SELECT * FROM resume_exp WHERE res_exp_id = ?`,
      [id]
    );
    return getResumeExpById[0];
  }

  async updateExp(data, updateData) {
    let updateOjt = {};
    if (data.job_title !== updateData.job_title) {
      updateOjt.job_title = updateData.job_title;
    }
    if (data.company_name !== updateData.company_name) {
      updateOjt.company_name = updateData.company_name;
    }
    if (data.start_date !== updateData.start_date) {
      updateOjt.start_date = updateData.start_date;
    }
    if (data.end_date !== updateData.end_date) {
      updateOjt.end_date = updateData.end_date;
    }
    if (data.description !== updateData.description) {
      updateOjt.description = updateData.description;
    }
    if (data.job_type !== updateData.job_type) {
      updateOjt.job_type = updateData.job_type;
    }

    const key = Object.keys(updateOjt);
    const val = Object.values(updateOjt);
    const setKeys = key.map((key) => `${key} = ?`).join(", ");

    const updateExp = await this.candidate.db.query(
      `UPDATE resume_exp SET ${setKeys} WHERE res_exp_id = ?`,
      [...val, data.res_exp_id]
    );
    return updateExp;
  }

  async deleteExp({id}) {
    const deleteExp = await this.candidate.db.query(
      `DELETE FROM resume_exp WHERE res_exp_id = ?`,
      [id]
    );
    return deleteExp;
  }

  async createResumeCertification({
    cert_name,
    cert_description,
    cert_link,
    cert_startDate,
    cert_endDate,
    cert_img,
    resume_id,
    user_id,
  }) {
    const resumeCertification = await this.candidate.db.query(
      `INSERT INTO resume_certificate (cert_name,cert_description,cert_link,cert_startDate,cert_endDate,cert_img,resume_id,user_id) VALUES(?,?,?,?,?,?,?,?)`,
      [
        cert_name,
        cert_description,
        cert_link,
        cert_startDate,
        cert_endDate,
        cert_img,
        resume_id,
        user_id,
      ]
    );
    return resumeCertification;
  }

  async getResumeCert({ id }) {
    const getCert = await this.candidate.db.query(
      `
        SELECT * FROM resume_certificate WHERE user_id = ?
      `,
      [id]
    );
    return getCert[0];
  }

  async createResumePersonalProj({
    proj_name,
    proj_description,
    proj_link,
    start_date,
    end_date,
    resume_id,
    user_id,
  }) {
    const project = await this.candidate.db.query(
      `INSERT INTO resume_personal_proj (proj_name,proj_description,proj_link,start_date,end_date,resume_id,user_id) VALUES(?,?,?,?,?,?,?)`,
      [
        proj_name,
        proj_description,
        proj_link,
        start_date,
        end_date,
        resume_id,
        user_id,
      ]
    );
    return project;
  }

  async getResumeProj({ id }) {
    const getProj = await this.candidate.db.query(
      `SELECT * FROM resume_personal_proj WHERE user_id = ?`,
      [id]
    );
    return getProj[0];
  }

  async createResumeContact({
    contact_address,
    contact_email,
    contact_phone,
    resume_id,
    user_id,
  }) {
    const resumeContact = await this.candidate.db.query(
      `INSERT INTO resume_contact (contact_address,contact_email,contact_phone,resume_id,user_id) VALUES(?,?,?,?,?)`,
      [contact_address, contact_email, contact_phone, resume_id, user_id]
    );
    return resumeContact;
  }

  async getResumeContact({ id }) {
    const getProj = await this.candidate.db.query(
      `SELECT * FROM resume_contact WHERE user_id = ?`,
      [id]
    );
    return getProj[0];
  }

  async updateResumeContact(data, updateData) {
    let updateOjt = {};
    if (data.contact_address !== updateData.contact_address) {
      updateOjt.contact_address = updateData.contact_address;
    }
    if (data.contact_email !== updateData.contact_email) {
      updateOjt.contact_email = updateData.contact_email;
    }
    if (data.contact_phone !== updateData.contact_phone) {
      updateOjt.contact_phone = updateData.contact_phone;
    }

    const key = Object.keys(updateOjt);
    const val = Object.values(updateOjt);
    const setKeys = key.map((key) => `${key} =? `).join(", ");

    const updateContact = await this.candidate.db.query(
      `UPDATE resume_contact SET ${setKeys} WHERE user_id = ?`,
      [...val, data.user_id]
    );
    return updateContact;
  }

  async createResumeInterest({ interest_name, resume_id, user_id }) {
    const interestJson = JSON.stringify(interest_name);
    const resumeInterest = await this.candidate.db.query(
      `INSERT INTO resume_interest (interest_name,resume_id,user_id) VALUES(?,?,?)`,
      [interestJson, resume_id, user_id]
    );
    return resumeInterest;
  }

  async getResumeInterest({ id }) {
    const getInterest = await this.candidate.db.query(
      `SELECT * FROM resume_interest WHERE user_id = ?`,
      [id]
    );
    return getInterest[0];
  }

  async updateResumeInterest({ interest_name, user_id }) {
    try {
      const updateInterest = JSON.stringify(interest_name);
      const interest = await this.candidate.db.query(
        `UPDATE resume_interest SET interest_name = ? WHERE user_id = ?`,
        [updateInterest, user_id]
      );
      return interest;
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  }

  async createResumeLang({ lang_name, resume_id, user_id }) {
    const langJson = JSON.stringify(lang_name);
    const resumeLang = await this.candidate.db.query(
      `
      INSERT INTO resume_lang (lang_name,resume_id,user_id) VALUES(?,?,?)`,
      [langJson, resume_id, user_id]
    );
    return resumeLang;
  }

  async getResumeLang({ id }) {
    const getLang = await this.candidate.db.query(
      `
      SELECT * FROM resume_lang WHERE user_id = ?
    `,
      [id]
    );
    return getLang[0];
  }

  async updateResumeLang({ lang_name, user_id }) {
    try {
      const updateLang = JSON.stringify(lang_name);
      const lang = await this.candidate.db.query(
        `UPDATE resume_lang SET lang_name = ? WHERE user_id = ?`,
        [updateLang, user_id]
      );
      return lang;
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  }

  async createResumeSkill({ skill_name, resume_id, user_id }) {
    const skills = JSON.stringify(skill_name);
    const addSkill = await this.candidate.db.query(
      `INSERT INTO resume_skill (skill_name,resume_id,user_id) VALUES(?,?,?)`,
      [skills, resume_id, user_id]
    );
    return addSkill;
  }

  async getResumeSkill({ id }) {
    const getSkill = await this.candidate.db.query(
      `SELECT * FROM resume_skill WHERE user_id = ?`,
      [id]
    );
    return getSkill[0];
  }

  async updateSkills({ skill_name, user_id }) {
    try {
      const updateSkill = JSON.stringify(skill_name);
      const skills = await this.candidate.db.query(
        `UPDATE resume_skill SET skill_name = ? WHERE user_id = ?`,
        [updateSkill, user_id]
      );
      return skills;
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  }
}

module.exports = Resume;
