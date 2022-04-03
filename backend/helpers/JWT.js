const jwt = require('jsonwebtoken');

const createAccessToken = async (user) => {
    return jwt.sign(
        {_id: user._id , roleId: user.roleId}, 
        process.env.ACCESS_TOKEN_SECRET, 
        {expiresIn: process.env.COOKIEEXPIRED}
    );
}

module.exports.createAccessToken = createAccessToken;