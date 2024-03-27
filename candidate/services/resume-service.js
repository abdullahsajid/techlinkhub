const resumeRepo = require("../database/repository/resume-repo");

class ResumeService {
  constructor() {
    this.resumeRepo = new resumeRepo();
  }

  async resume({ name, description, title, img, candidateId }) {
    const resume = await this.resumeRepo.createResume({
      name,
      description,
      title,
      img,
      candidateId,
    });
    return resume;
  }

  async getResume({id}){
    const getResume = await this.resumeRepo.getResumeHeader({id})
    return getResume
  }

  async resumeEdu({
    program_name,
    institution_name,
    start_date,
    end_date,
    description,
    resume_id,
    user_id,
  }) {
    const resumeEdu = await this.resumeRepo.createResumeEdu({
      program_name,
      institution_name,
      start_date,
      end_date,
      description,
      resume_id,
      user_id,
    });
    return resumeEdu;
  }

  async getResumeEdu({id}){
    const getEdu = await this.resumeRepo.getResumeEdu({id})
    return getEdu
  }

  async resumeExp({
    job_title,
    company_name,
    start_date,
    end_date,
    description,
    job_type,
    resume_id,
    user_id,
  }) {
    const resumeExp = await this.resumeRepo.createResumeExp({
      job_title,
      company_name,
      start_date,
      end_date,
      description,
      job_type,
      resume_id,
      user_id,
    });
    return resumeExp;
  }

  async getResumeExp({id}){
    const getExp = await this.resumeRepo.getResumeExp({id})
    return getExp
  }

  async resumeCertification({
    cert_name,
    cert_description,
    cert_link,
    cert_startDate,
    cert_endDate,
    cert_img,
    resume_id,
    user_id,
  }) {
    const resumeCert = await this.resumeRepo.createResumeCertification({
      cert_name,
      cert_description,
      cert_link,
      cert_startDate,
      cert_endDate,
      cert_img,
      resume_id,
      user_id,
    });
    return resumeCert;
  }

  async resumePersonalProj({
    proj_name,
    proj_description,
    proj_link,
    start_date,
    end_date,
    resume_id,
    user_id,
  }) {
    const resumePersonalProj = await this.resumeRepo.createResumePersonalProj({
      proj_name,
      proj_description,
      proj_link,
      start_date,
      end_date,
      resume_id,
      user_id,
    });
    return resumePersonalProj;
  }

  async getResumePersonalProj({id}){
    const getExp = await this.resumeRepo.getResumeProj({id})
    return getExp
  }

  async resumeContact({
    contact_address,
    contact_email,
    contact_phone,
    resume_id,
    user_id,
  }) {
    const contact = await this.resumeRepo.createResumeContact({
      contact_address,
      contact_email,
      contact_phone,
      resume_id,
      user_id,
    });
    return contact;
  }

  async getResumeContacts({id}){
    const getExp = await this.resumeRepo.getResumeContact({id})
    return getExp
  }

  async resumeInterest({interest_name, resume_id, user_id}) {
    const interest = await this.resumeRepo.createResumeInterest({interest_name, resume_id, user_id})
    return interest
  }

  async resumeLang({lang_name, resume_id, user_id}) {
    const lang = await this.resumeRepo.createResumeLang({lang_name, resume_id, user_id})
    return lang
  }
  

}

module.exports = ResumeService;
