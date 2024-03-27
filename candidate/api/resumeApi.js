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

};
