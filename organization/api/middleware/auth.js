const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        const authLabel = req.headers["authorization"]; 
        if (!authLabel || !authLabel.startsWith("Bearer ")) {
            return res.status(403).json({ message: "Invalid token format" });
        }
        
        const [bearer, token] = authLabel.split(' ');
        const payload = await jwt.verify(token, process.env.JWT_AUTH);
        req.user = payload;
        return next();
    } catch (err) {
        console.error(err)
        return res.status(403).json({ message: "Not authorized!" });
    }
};
