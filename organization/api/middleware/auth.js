const jwt = require('jsonwebtoken')

module.exports = async (req,res,next) => {
    try{
        const authLabel = req.get("Authorization")
        const payload = await jwt.verify(authLabel.split(' ')[1],process.env.JWT_AUTH)
        req.user =  payload
        return next()
    }catch(err){
        res.status(403).json({message:"not auth!"})
        throw err
    }
}