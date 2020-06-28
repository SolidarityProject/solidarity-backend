const jwt = require("jsonwebtoken");

//* create token (1h) 
function createToken(user) { // TODO : async function
    return jwt.sign({
        _id: user._id,
        activeStatus: user.activeStatus,
        verifiedStatus: user.verifiedStatus
    }, process.env.SECRET_KEY, { expiresIn: "1h" }) // default encryption algoritm : HS256
}

//* verify token
function verifyToken(req, res, next) {
    // move to -> middlewares // TODO : delete this function
}

module.exports = { createToken, verifyToken };