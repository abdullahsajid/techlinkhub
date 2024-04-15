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

  async updateDetails(id,updateData){
    const getResume = await this.resumeRepo.getResumeHeader({id})
    const data = getResume[0]
    const update = await this.resumeRepo.updateResume(data,updateData)
    return update
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

  async updateResumeEdu(id,updateData){
    const getResume = await this.resumeRepo.getResumeEduFindById({id})
    const data = getResume[0]
    const update = await this.resumeRepo.updateEdu(data,updateData)
    return update
  }

  async deleteResumeEdu({id}) {
    const getResume = await this.resumeRepo.deleteEdu({id})
    return getResume
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

  async updateResumeExp(id,updateData){
    const getResume = await this.resumeRepo.getResumeExpFindById({id})
    const data = getResume[0]
    const update = await this.resumeRepo.updateExp(data,updateData)
    return update
  }

  async delExp({id}){
    const getResume = await this.resumeRepo.deleteExp({id})
    return getResume
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

  async getResumeCertificate({id}){
    const getCert = await this.resumeRepo.getResumeCert({id})
    return getCert
  }

  async updateResumeCert(id,updateData){
    const getResume = await this.resumeRepo.getResumeCertFindById({id})
    const data = getResume[0]
    const update = await this.resumeRepo.updateCert(data,updateData)
    return update
  }

  async delCert({id}){
    const getResume = await this.resumeRepo.deleteCert({id})
    return getResume
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
    const getProj = await this.resumeRepo.getResumeProj({id})
    return getProj
  }

  async updateResumeProj(id,updateData){
    const getResume = await this.resumeRepo.getResumeProjFindById({id})
    const data = getResume[0]
    const update = await this.resumeRepo.updateProj(data,updateData)
    return update
  }

  async delProj({id}){
    const getResume = await this.resumeRepo.deleteProj({id})
    return getResume
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
    const getContact = await this.resumeRepo.getResumeContact({id})
    return getContact
  }

  async updateContact(id,updateData){
    const getResume = await this.resumeRepo.getResumeContact({id})
    const data = getResume[0]
    const update = await this.resumeRepo.updateResumeContact(data,updateData)
    return update
  }

  async resumeInterest({interest_name, resume_id, user_id}) {
    const interest = await this.resumeRepo.createResumeInterest({interest_name, resume_id, user_id})
    return interest
  }

  async getInterest({id}) {
    const interest = await this.resumeRepo.getResumeInterest({id})
    return interest
  }

  async updateInterest({interest_name,user_id}) {
    const interest = await this.resumeRepo.updateResumeInterest({interest_name,user_id})
    return interest
  }

  async resumeLang({lang_name, resume_id, user_id}) {
    const lang = await this.resumeRepo.createResumeLang({lang_name, resume_id, user_id})
    return lang
  }

  async getLang({id}) {
    const lang = await this.resumeRepo.getResumeLang({id})
    return lang
  }

  async updateLang({lang_name,user_id}) {
    const lang = await this.resumeRepo.updateResumeLang({lang_name,user_id})
    return lang
  }

  async resumeSkill({skill_name, resume_id,user_id}){
    const skill = await this.resumeRepo.createResumeSkill({skill_name, resume_id,user_id})
    return skill
  }

  async getSkill({id}){
    const skill = await this.resumeRepo.getResumeSkill({id})
    return skill
  }

  async updateResumeSkills({skill_name,user_id}){
    const skill = await this.resumeRepo.updateSkills({skill_name,user_id})
    return skill
  }

  async ResumeTemplate({template_name, resume_id, user_id}){
    const template = await this.resumeRepo.SetResumeTemplate({template_name, resume_id, user_id})
    return template
  }

  async updateTemplate({template_name, id }){
    const template = await this.resumeRepo.updateResumeTemplate({template_name, id })
    return template
  }

  async ResumeData({name}){
    const data = await this.resumeRepo.getUserByName({name})
    const allData = data[0].id
    const templateData = await this.resumeRepo.getResumeTemplate(allData)
    return templateData
  }

}

module.exports = ResumeService;
