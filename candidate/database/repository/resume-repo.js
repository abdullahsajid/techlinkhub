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

  async createResumeInterest({ interest_name, resume_id, user_id }) {
    const interestJson = JSON.stringify(interest_name);
    const resumeInterest = await this.candidate.db.query(
      `INSERT INTO resume_interest (interest_name,resume_id,user_id) VALUES(?,?,?)`,
      [interestJson, resume_id, user_id]
    );
    return resumeInterest;
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
}

module.exports = Resume;
