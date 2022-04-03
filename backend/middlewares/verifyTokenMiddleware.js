const jwt = require('jsonwebtoken');

const verifyAccessToken = (req, res, next) => {
    const accessToken = req.cookies["access-token"];
    if(!accessToken) return res.status(401).send('Pristup nije dozvoljen!');

    try {
        const verified = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(401).send('Pristup nije dozvoljen!');
    }   
}

module.exports.verifyAccessToken = verifyAccessToken;