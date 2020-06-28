const jwt = require("jsonwebtoken");

// TODO : auth -> activeStatus, verifiedStatus control

function auth(req, res, next) {
    const token = req.header("Token");
    if (!token) return res.status(401).send("Access Denied.");

    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY);

        //* checking user for authorization (is active account ?)
        if (!verified.activeStatus) return res.status(400).send("Access Denied.");

        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send("Invalid Token.");
    }
}

function auth_checkUser(req, res, next) {
    const token = req.header("Token");
    if (!token) return res.status(401).send("Access Denied.");

    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY);

        //* checking user for authorization (is active & own account ?)
        if (!verified.activeStatus || verified._id != req.body._id) return res.status(400).send("Access Denied.");

        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send("Invalid Token.");
    }
}

module.exports = { auth, auth_checkUser }