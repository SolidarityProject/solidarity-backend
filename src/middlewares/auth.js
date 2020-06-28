const jwt = require("jsonwebtoken");

// TODO : auth -> activeStatus, verifiedStatus control

//* verify token
function auth(req, res, next) {
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

module.exports = { auth }