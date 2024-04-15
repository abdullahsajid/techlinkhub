const SkillAssessmentService = require("../services/skillAssessmentService");
const auth = require('./middleware/auth');
module.exports = (app) => {
    const skillAssessmentService = new SkillAssessmentService();
    
    app.post("/createSkillType",auth, async (req, res) => {
        const data = await skillAssessmentService.setSkillType({
            st_type: req.body.st_type,
            user_id: req.user.id,
        });
        res.status(201).json({
            data: data,
            message: "Skill Type created successfully!",
        });
    });

}