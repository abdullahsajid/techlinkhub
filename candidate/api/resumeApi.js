const ResumeService = require("../services/resume-service");
const auth = require("./middleware/auth");

module.exports = (app) => {
  const resumeService = new ResumeService();

  app.post("/resumes", auth, async (req, res) => {
    try {
      const data = await resumeService.resume({
        name: req.body.name,
        description: req.body.description,
        title: req.body.title,
        img: req.body.img,
        candidateId: req.user.id,
      });

      res.status(201).json({ data, message: "resume created successfully!" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/getResume',auth,async (req,res) => {
    try{
      const data = await resumeService.getResume({id:req.user.id})
      res.status(200).json({data,message:"retrieve successfully!"})
    }catch(err){
        res.status(500).json({message:err.message})
    }
  })

  app.delete('/deleteExp/:id',auth,async (req,res) => {
    try{
      const data = await resumeService.delExp({id:req.params.id})
      res.status(200).json({data,message:"delete successfully!"})
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
  })

  app.put('/updateResume',auth,async (req,res) => {
    try{
      const id = req.user.id
      const data = await resumeService.updateDetails(id,{
        name:req.body.name,
        description:req.body.description,
        title:req.body.title,
        img:req.body.img
      })
      res.status(200).json({data,message:"update successfully!"})
    }catch(err){
        res.status(500).json({message:err.message})
    }
  })

  app.post("/resumeEdu", auth, async (req, res) => {
    try {
      const data = await resumeService.resumeEdu({
        program_name: req.body.program_name,
        institution_name: req.body.institution_name,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        description: req.body.description,
        resume_id: req.body.resume_id,
        user_id: req.user.id,
      });
      res
        .status(201)
        .json({ data, message: "resume education created successfully!" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/getEdu',auth,async (req,res) => {
    try{
      const data = await resumeService.getResumeEdu({id:req.user.id})
      res.status(200).json({data,message:"retrieve successfully!"})
    }catch(err){
        res.status(500).json({message:err.message})
    }
  })

  app.put('/updateEdu/:id',auth,async (req,res) => {
    try{
      const data = await resumeService.updateResumeEdu(req.params.id,{
        program_name:req.body.program_name,
        institution_name:req.body.institution_name,
        start_date:req.body.start_date,
        end_date:req.body.end_date,
        description:req.body.description
      })
      res.status(200).json({data,message:"update successfully!"})
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
  })

  app.delete('/deleteEdu/:id',auth,async (req,res) => {
    try{
      const data = await resumeService.deleteResumeEdu({id:req.params.id})
      res.status(200).json({data,message:"delete successfully!"})
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
  })

  app.post("/resumeExp", auth, async (req, res) => {
    try {
      const data = await resumeService.resumeExp({
        job_title: req.body.job_title,
        company_name: req.body.company_name,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        description: req.body.description,
        job_type: req.body.job_type,
        resume_id: req.body.resume_id,
        user_id: req.user.id,
      });
      res
        .status(201)
        .json({ data, message: "resume experience created successfully!" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/getExp',auth,async (req,res) => {
    try{
      const data = await resumeService.getResumeExp({id:req.user.id})
      res.status(200).json({data,message:"retrieve successfully!"})
    }catch(err){
        res.status(500).json({message:err.message})
    }
  })

  app.put('/updateExp/:id',auth,async (req,res) => {
    try{
      const data = await resumeService.updateResumeExp(req.params.id,{ 
        job_title:req.body.job_title,
        company_name:req.body.company_name,
        start_date:req.body.start_date,
        end_date:req.body.end_date,
        description:req.body.description,
        job_type:req.body.job_type
      })  
      res.status(200).json({data,message:"update successfully!"})
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
  })

  app.post("/resumeCert", auth, async (req, res) => {
    try {
      const data = await resumeService.resumeCertification({
        cert_name: req.body.cert_name,
        cert_description: req.body.cert_description,
        cert_link: req.body.cert_link,
        cert_startDate: req.body.cert_startDate,
        cert_endDate: req.body.cert_endDate,
        cert_img: req.body.cert_img,
        resume_id: req.body.resume_id,
        user_id: req.user.id,
      });
      res
        .status(201)
        .json({ data, message: "resume certification created successfully!" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/getCert',auth,async (req,res) => {
    try{
      const data = await resumeService.getResumeCertificate({id:req.user.id})
      res.status(200).json({data,message:"retrieve successfully!"})
    }catch(err){
        res.status(500).json({message:err.message})
    }
  })

  app.put('/updateCert/:id',auth,async (req,res) => {
    try{
      const data = await resumeService.updateResumeCert(req.params.id,{
        cert_name:req.body.cert_name,
        cert_description:req.body.cert_description,
        cert_link:req.body.cert_link,
        cert_startDate:req.body.cert_startDate,
        cert_endDate:req.body.cert_endDate,
        cert_img:req.body.cert_img
      })
      res.status(200).json({data,message:"update successfully!"})
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
  })

  app.delete('/deleteCert/:id',auth,async (req,res) => {
    try{
      const data = await resumeService.delCert({id:req.params.id})
      res.status(200).json({data,message:"delete successfully!"})
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
  })


  app.post("/resumePersonalProj", auth, async (req, res) => {
    try {
      const data = await resumeService.resumePersonalProj({
        proj_name: req.body.proj_name,
        proj_description: req.body.proj_description,
        proj_link: req.body.proj_link,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        resume_id: req.body.resume_id,
        user_id: req.user.id,
      });
      res
        .status(201)
        .json({
          data,
          message: "resume personal project created successfully!",
        });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/getproj',auth,async (req,res) => {
    try{
      const data = await resumeService.getResumePersonalProj({id:req.user.id})
      res.status(200).json({data,message:"retrieve successfully!"})
    }catch(err){
        res.status(500).json({message:err.message})
    }
  })

  app.put('/updateProj/:id',auth,async (req,res) => {
    try{
      const data = await resumeService.updateResumeProj(req.params.id,{
        proj_name:req.body.proj_name,
        proj_description:req.body.proj_description,
        proj_link:req.body.proj_link,
        start_date:req.body.start_date,
        end_date:req.body.end_date
      })
      res.status(200).json({data,message:"update successfully!"})
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
  })

  app.delete('/deleteProj/:id',auth,async (req,res) => {
    try{
      const data = await resumeService.delProj({id:req.params.id})
      res.status(200).json({data,message:"delete successfully!"})
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
  })

  app.post("/resumeContact", auth, async (req, res) => {
    try {
      const data = await resumeService.resumeContact({
        contact_address: req.body.contact_address,
        contact_email: req.body.contact_email,
        contact_phone: req.body.contact_phone,
        resume_id: req.body.resume_id,
        user_id: req.user.id,
      });
      res
        .status(201)
        .json({ data, message: "resume contact created successfully!" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/getContact',auth,async (req,res) => {
    try{
      const data = await resumeService.getResumeContacts({id:req.user.id})
      res.status(200).json({data,message:"retrieve successfully!"})
    }catch(err){
        res.status(500).json({message:err.message})
    }
  })

  app.put('/updateContact',auth,async (req,res) => {
    try{
      const data = await resumeService.updateContact(req.user.id,{
        contact_address:req.body.contact_address,
        contact_email:req.body.contact_email,
        contact_phone:req.body.contact_phone
      })
      res.status(200).json({data,message:"update successfully!"})
    }catch(err){
        res.status(500).json({message:err.message})
    }
  })

  app.post("/resumeInterest", auth, async (req, res) => {
    try {
      const data = await resumeService.resumeInterest({
        interest_name: req.body.interest_name,
        resume_id: req.body.resume_id,
        user_id: req.user.id,
      });
      res
        .status(201)
        .json({ data, message: "resume interest created successfully!" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/getInterest',auth,async (req,res) => {
    try{
      const data = await resumeService.getInterest({id:req.user.id})
      res.status(200).json({data,message:"retrieve successfully!"})
    }catch(err){
        res.status(500).json({message:err.message})
    }
  })

  app.put('/updateInterest',auth,async (req,res) => {
    try{
      const data = await resumeService.updateInterest({interest_name:req.body.interest_name,user_id:req.user.id})
      res.status(200).json({data,message:"update successfully!"})
    }catch(err){
        res.status(500).json({message:err.message})
    }
  })

  app.post("/resumeLang",auth , async (req,res) => {
    try{
        const data = await resumeService.resumeLang({
            lang_name:req.body.lang_name,
            resume_id:req.body.resume_id,
            user_id:req.user.id
        })
        res.status(201).json({data,message:"resume language created successfully!"})
    }catch(err){
        res.status(500).json({message:err.message})
    }
  })

  app.get('/getLang',auth,async (req,res) => {
    try{
      const data = await resumeService.getLang({id:req.user.id})
      res.status(200).json({data,message:"retrieve successfully!"})
    }catch(err){
        res.status(500).json({message:err.message})
    }
  })

  app.put('/updateLang',auth,async (req,res) => {
    try{
      const data = await resumeService.updateLang({lang_name:req.body.lang_name,user_id:req.user.id})
      res.status(200).json({data,message:"update successfully!"})
    }catch(err){
        res.status(500).json({message:err.message})
    }
  })

  app.post("/resumeSkill",auth , async (req,res) => {
    try{
        const data = await resumeService.resumeSkill({
            skill_name:req.body.skill_name,
            resume_id:req.body.resume_id,
            user_id:req.user.id
        })
        res.status(201).json({data,message:"resume language created successfully!"})
    }catch(err){
        res.status(500).json({message:err.message})
    }
  })

  app.get('/getSkill',auth,async (req,res) => {
    try{
      const data = await resumeService.getSkill({id:req.user.id})
      res.status(200).json({data,message:"retrieve successfully!"})
    }catch(err){
        res.status(500).json({message:err.message})
    }
  })

  app.put('/updateSkill',auth,async (req,res) => {
    try{
      const data = await resumeService.updateResumeSkills({skill_name:req.body.skill_name,user_id:req.user.id})
      res.status(200).json({data,message:"update successfully!"})
    }catch(err){
        res.status(500).json({message:err.message})
    }
  })

  app.post("/setTemplates",auth,async (req,res) => {
    try{
      const data = await resumeService.ResumeTemplate({
        template_name:req.body.template_name,
        resume_id:req.body.resume_id,
        user_id:req.user.id
      })
      res.status(201).json({data,message:"template created successfully!"})
    }catch(err){
      res.status(500).json({message:err.message})
    }
  })

  app.put('/updateTemplate',auth,async (req,res) => {
    try{
      const data = await resumeService.updateTemplate({template_name:req.body.template_name,id:req.body.id})
      res.status(200).json({data,message:"update successfully!"})
    }catch(err){
      res.status(500).json({message:err.message})
    }
  })

  app.get('/myResume/:username',async (req,res) => {
    try{
      const data = await resumeService.ResumeData({name:req.params.username})
      res.status(200).json({data,message:"retrieve successfully!"})
    }catch(err){
      res.status(500).json({message:err.message})
    }
  })

};
