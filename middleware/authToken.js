const jwt = require('jsonwebtoken');

module.exports = authToken = (req, res, next) => {
    
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return  res.sendStatus(401);
    
    jwt.verify(token, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) return res.sendStatus(403);

        req.user = user
        next()
    })
};