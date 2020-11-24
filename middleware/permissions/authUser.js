const jwt = require('jsonwebtoken');

module.exports = authUser = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        console.log(decoded)
        console.log(req.userData)
        next();

    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        })
    }
};