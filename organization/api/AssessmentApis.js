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
            success: true,
            message: "Skill Type created successfully!",
        });
    });

    app.post("/createQuestion",auth, async (req, res) => {
        const questionsData = req.body.questionsData;
        const user_id = req.user.id;
        const insertedQuestions = await skillAssessmentService.setQuestion(questionsData,user_id);
        res.status(201).json({
            data: insertedQuestions,
            message: "Questions created successfully!",
        });
    })

    app.get('/calculateScore',auth, async (req,res) => {
        const optionPayload = req.body.optionPayload;
        const user_id = req.user.id;
        const skill_id = req.body.skill_id;
        const calData = await skillAssessmentService.calculateScore(optionPayload,skill_id,user_id);
        res.status(200).json({
            data: calData,
            message: 'Score calculated successfully!'
        })
    })

    app.get('/getmcqs',auth, async (req,res) => {
        const id = req.body.id;
        const data = await skillAssessmentService.skillBaseMcqs(id);
        res.status(200).json({
            data: data,
            message: 'Mcqs fetched successfully!'
        })
    })

}