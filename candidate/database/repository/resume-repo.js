const CandidateRepository = require("./candidate-repo");
const cloudinary = require("cloudinary");

class Resume {
  constructor() {
    this.candidate = new CandidateRepository();
  }

  async createResume({ name, description, title, img, candidateId }) {
    let selectItem = {};
    if (name !== '') {
      selectItem.name = name;
    }
    if (description !== '') {
      selectItem.description = description;
    }
    if (title !== '') {
      selectItem.title = title;
    }
    if (img !== '') {
      const tlhavatar = await cloudinary.v2.uploader.upload(img, {
        folder: "tlkavatar",
      });
      const profileAvatar = tlhavatar.secure_url;
      selectItem.img = profileAvatar;
    }
    const key = Object.keys(selectItem);
    const val = Object.values(selectItem);
    const setKeys = key.map((key) => `${key} = ?`).join(", ");

    const resume = await this.candidate.db.query(
      `INSERT INTO resume SET ${setKeys}, cand_user_id = ?`,
      [...val,candidateId]
    );
    return resume;
  }

  async updateResume(data, updateData) {
    let updateOj = {};
    if (data.name !== updateData.name || data.name === null) {
      updateOj.name = updateData.name;
    }
    if (data.description !== updateData.description || data.description === null) {
      updateOj.description = updateData.description;
    }
    if (data.title !== updateData.title || data.title === null) {
      updateOj.title = updateData.title;
    }
    if (data.img !== updateData.img) {
      if(data.img === null) {
        const tlhavatar = await cloudinary.v2.uploader.upload(updateData.img, {
          folder: "tlkavatar",
        });
        updateOj.img = tlhavatar.secure_url;
      }else{
        const extract_id = await data.img.split("/").pop().split(".")[0];
        const public_id = `tlkavatar/${extract_id}`;
        await cloudinary.v2.uploader.destroy(public_id);
        const tlhavatar = await cloudinary.v2.uploader.upload(updateData.img, {
          folder: "tlkavatar",
        });
        updateOj.img = tlhavatar.secure_url;
      }
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
    let selectItem = {};
    if (program_name !== '') {
      selectItem.program_name = program_name;
    }
    if (institution_name !== '') {
      selectItem.institution_name = institution_name;
    }
    if(description !== '') {
      selectItem.description = description;
    }
    const key = Object.keys(selectItem);
    const val = Object.values(selectItem);
    const setKeys = key.map((key) => `${key} = ?`).join(", ");

    const resumeEdu = await this.candidate.db.query(
      `INSERT INTO resume_edu SET ${setKeys}, resume_id = ?, user_id = ?`,
      [
        ...val,
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
      `SELECT * FROM resume_edu WHERE res_edu_id = ?`,
      [id]
    );
    return getResumeEduById[0];
  }

  async updateEdu(data, updateData) {
    let updateOjt = {};
    if (data.program_name !== updateData.program_name || data.program_name === null) {
      updateOjt.program_name = updateData.program_name;
    }
    if (data.institution_name !== updateData.institution_name || data.institution_name === null) {
      updateOjt.institution_name = updateData.institution_name;
    }
    if (data.start_date !== updateData.start_date) {
      updateOjt.start_date = updateData.start_date;
    }
    if (data.end_date !== updateData.end_date) {
      updateOjt.end_date = updateData.end_date;
    }
    if (data.description !== updateData.description || data.description === null) {
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

  async deleteEdu({ id }) {
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
    let selectItem = {};
    if (job_title !== '') {
      selectItem.job_title = job_title;
    }
    if (company_name !== '') {
      selectItem.company_name = company_name;
    }
    if(description !== '') {
      selectItem.description = description;
    }
    if (job_type !== '') {
      selectItem.job_type = job_type;
    }
    const key = Object.keys(selectItem);
    const val = Object.values(selectItem);
    const setKeys = key.map((key) => `${key} = ?`).join(", ");

    const resumeExp = await this.candidate.db.query(
      `
      INSERT INTO resume_exp SET ${setKeys}, resume_id = ?, user_id = ?`,
      [
        ...val,
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
    if (data.job_title !== updateData.job_title || data.job_title === null) {
      updateOjt.job_title = updateData.job_title;
    }
    if (data.company_name !== updateData.company_name || data.company_name === null) {
      updateOjt.company_name = updateData.company_name;
    }
    if (data.start_date !== updateData.start_date) {
      updateOjt.start_date = updateData.start_date;
    }
    if (data.end_date !== updateData.end_date) {
      updateOjt.end_date = updateData.end_date;
    }
    if (data.description !== updateData.description || data.description === null) {
      updateOjt.description = updateData.description;
    }
    if (data.job_type !== updateData.job_type || data.job_type === null) {
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

  async deleteExp({ id }) {
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
    let selectItem = {};
    if (cert_name !== '') {
      selectItem.cert_name = cert_name;
    }
    if (cert_description !== '') {
      selectItem.cert_description = cert_description;
    }
    if (cert_link !== '') {
      selectItem.cert_link = cert_link;
    }
    const key = Object.keys(selectItem);
    const val = Object.values(selectItem);
    const setKeys = key.map((key) => `${key} = ?`).join(", ");

    const resumeCertification = await this.candidate.db.query(
      `INSERT INTO resume_certificate SET ${setKeys}, resume_id = ?, user_id = ?`,
      [
        ...val, 
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

  async getResumeCertFindById({ id }) {
    const getResumeCertById = await this.candidate.db.query(
      `SELECT * FROM resume_certificate WHERE certifacte_id = ?`,
      [id]
    );
    return getResumeCertById[0];
  }

  async updateCert(data, updateData) {
    let updateOjt = {};
    if (data.cert_name !== updateData.cert_name || data.cert_name === null) {
      updateOjt.cert_name = updateData.cert_name;
    }
    if (data.cert_description !== updateData.cert_description || data.cert_description === null) {
      updateOjt.cert_description = updateData.cert_description;
    }
    if (data.cert_link !== updateData.cert_link || data.cert_link === null) {
      updateOjt.cert_link = updateData.cert_link;
    }
    if (data.cert_startDate !== updateData.cert_startDate) {
      updateOjt.cert_startDate = updateData.cert_startDate;
    }
    if (data.cert_endDate !== updateData.cert_endDate) {
      updateOjt.cert_endDate = updateData.cert_endDate;
    }

    const key = Object.keys(updateOjt);
    const val = Object.values(updateOjt);
    const setKeys = key.map((key) => `${key} = ?`).join(", ");
    const updateCert = await this.candidate.db.query(
      `UPDATE resume_certificate SET ${setKeys} WHERE certifacte_id = ?`,
      [...val, data.certifacte_id]
    );
    return updateCert;
  }

  async deleteCert({ id }) {
    const deleteCert = await this.candidate.db.query(
      `DELETE FROM resume_certificate WHERE certifacte_id = ?`,
      [id]
    );
    return deleteCert;
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
    let selectItem = {};
    if (proj_name !== '') {
      selectItem.proj_name = proj_name;
    }
    if (proj_description !== '') {
      selectItem.proj_description = proj_description;
    }
    if (proj_link !== '') {
      selectItem.proj_link = proj_link;
    }
    const key = Object.keys(selectItem);
    const val = Object.values(selectItem);
    const setKeys = key.map((key) => `${key} = ?`).join(", ");


    const project = await this.candidate.db.query(
      `INSERT INTO resume_personal_proj SET ${setKeys}, resume_id = ?, user_id = ?`,
      [...val,resume_id,user_id,]
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

  async getResumeProjFindById({ id }) {
    const getResumeProjById = await this.candidate.db.query(
      `SELECT * FROM resume_personal_proj WHERE res_proj_id = ?`,
      [id]
    );
    return getResumeProjById[0];
  }

  async updateProj(data, updateData) {
    let updateOjt = {};
    if (data.proj_name !== updateData.proj_name || data.proj_name === null) {
      updateOjt.proj_name = updateData.proj_name;
    }
    if (data.proj_description !== updateData.proj_description || data.proj_description === null) {
      updateOjt.proj_description = updateData.proj_description;
    }
    if (data.proj_link !== updateData.proj_link || data.proj_link === null) {
      updateOjt.proj_link = updateData.proj_link;
    }
    if (data.start_date !== updateData.start_date) {
      updateOjt.start_date = updateData.start_date;
    }
    if (data.end_date !== updateData.end_date) {
      updateOjt.end_date = updateData.end_date;
    }

    const key = Object.keys(updateOjt);
    const val = Object.values(updateOjt);
    const setKeys = key.map((key) => `${key} = ?`).join(", ");

    const updateProj = await this.candidate.db.query(
      `UPDATE resume_personal_proj SET ${setKeys} WHERE res_proj_id = ?`,
      [...val, data.res_proj_id]
    );
    return updateProj;
  }

  async deleteProj({ id }) {
    const deleteProj = await this.candidate.db.query(
      `DELETE FROM resume_personal_proj WHERE res_proj_id = ?`,
      [id]
    );
    return deleteProj;
  }

  async createResumeContact({
    contact_address,
    contact_email,
    contact_phone,
    resume_id,
    user_id,
  }) {
    let selectItem = {}
    if (contact_address !== '') {
      selectItem.contact_address = contact_address;
    }
    if (contact_email !== '') {
      selectItem.contact_email = contact_email;
    }
    if (contact_phone !== '') {
      selectItem.contact_phone = contact_phone;
    }
    const key = Object.keys(selectItem);
    const val = Object.values(selectItem);
    const setKeys = key.map((key) => `${key} = ?`).join(", ");

    const resumeContact = await this.candidate.db.query(
      `INSERT INTO resume_contact SET ${setKeys}, resume_id = ?, user_id = ?`,
      [...val, resume_id, user_id]
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
    if (data.contact_address !== updateData.contact_address || data.contact_address === null) {
      updateOjt.contact_address = updateData.contact_address;
    }
    if (data.contact_email !== updateData.contact_email || data.contact_email === null) {
      updateOjt.contact_email = updateData.contact_email;
    }
    if (data.contact_phone !== updateData.contact_phone || data.contact_phone === null) {
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

  async SetResumeTemplate({ template_name, resume_id, user_id }) {
    const template = await this.candidate.db.query(
      `INSERT INTO resume_template (template_name,resume_id,user_id) VALUES(?,?,?)`,
      [template_name, resume_id, user_id]
    );
    return template;
  }

  async updateResumeTemplate({ template_name, id }) {
    const template = await this.candidate.db.query(
      `UPDATE resume_template SET template_name = ? WHERE template_id = ?`,
      [template_name, id]
    );
    return template;
  }

  async getUserByName({ name }) {
    const user = await this.candidate.db.query(
      `SELECT * FROM signup WHERE name = ?`,
      [name]
    );
    return user[0];
  }

  async getResumeTemplate(id) {
    const getTemplate = await this.candidate.db.query(
      `SELECT 
          JSON_ARRAYAGG(
            JSON_OBJECT(
                'template_id', rt.template_id,
                'template_name', rt.template_name
                ) 
          ) AS resumeTemplate,
          JSON_ARRAYAGG(
            JSON_OBJECT(
                'name', rh.name,
                'description', rh.description,
                'title', rh.title,
                'img', rh.img
                ) 
          ) AS resumeHeader,
          JSON_ARRAYAGG(
            JSON_OBJECT(
                'skills', rs.skill_name
                )
          ) AS resSkill,
          JSON_ARRAYAGG(
            JSON_OBJECT(
                'interest', ri.interest_name
                )
          ) AS resInterests,
          JSON_ARRAYAGG(
            JSON_OBJECT(
                'lang', rl.lang_name
                )
          ) AS resLanguages,
          JSON_ARRAYAGG(
            JSON_OBJECT(
                'address', rc.contact_address,
                'email', rc.contact_email,
                'phone', rc.contact_phone
                )
          )AS resContact,
          (SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    'name', rct.cert_name,
                    'description', rct.cert_description,
                    'link', rct.cert_link
                )
            ) 
            FROM resume_certificate rct 
            WHERE user.id = rct.user_id
          ) AS resCertificate,
          (SELECT JSON_ARRAYAGG(
              JSON_OBJECT(
                  'pname', re.program_name,
                  'iname', re.institution_name,
                  'desc', re.description
              )
            ) 
            FROM resume_edu re 
            WHERE user.id = re.user_id
          )AS resEdu,
          (SELECT JSON_ARRAYAGG(
              JSON_OBJECT(
                  'jtitle', rexp.job_title,
                  'cname', rexp.company_name,
                  'desc', rexp.description,
                  'jtype',rexp.job_type
              )
            ) 
            FROM resume_exp rexp 
            WHERE user.id = rexp.user_id
          ) AS resExp,
          (SELECT JSON_ARRAYAGG(
              JSON_OBJECT(
                  'pname', rpp.proj_name,
                  'pdesc', rpp.proj_description,
                  'plink', rpp.proj_link 
              )
            ) 
            FROM resume_personal_proj rpp 
            WHERE user.id = rpp.user_id
          ) AS resProj
        FROM 
            signup user
        LEFT JOIN resume_template rt on user.id = rt.user_id
        LEFT JOIN resume rh on user.id = rh.cand_user_id
        LEFT JOIN resume_skill rs on user.id = rs.user_id
        LEFT JOIN resume_interest ri on user.id = ri.user_id
        LEFT JOIN resume_lang rl on user.id = rl.user_id
        LEFT JOIN resume_contact rc on user.id = rc.user_id
        WHERE
          user.id = ?
        GROUP BY
          user.id
        `,
      [id]
    );
    return getTemplate[0];
  }
}

module.exports = Resume;
