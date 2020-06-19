const jwt = require("jsonwebtoken");

//* create token (1h) 
function createToken(user) {
    return jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" }) // default encryption algoritm : HS256
}

//* verify token
function verifyToken(req, res, next) {
    const token = req.header("Token");
    if (!token) return res.status(401).send("Access Denied.");

    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send("Invalid Token.");
    }
}

module.exports = { createToken, verifyToken };