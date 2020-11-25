const jwt = require('jsonwebtoken');

module.exports = authUser = (req, res, next) => {
    
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return  res.sendStatus(401);

    jwt.verify(token, process.env.JWT_PRIVATE_KEY, (err, user) => {
        if (err) return res.sendStatus(403);

        req.user = user
        next()
    })
};