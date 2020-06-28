const jwt = require("jsonwebtoken");
const helper = require("../helpers/auth-control-helper");

function auth(req, res, next) {
    const token = req.header("Token");
    if (!token) return res.status(401).send("Access Denied.");

    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY);

        //* checking account -> is active account ?
        if (helper.auth_error(verified)) return res.status(400).send("Access Denied.");

        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send("Invalid Token.");
    }
}

function auth_user(req, res, next) {
    const token = req.header("Token");
    if (!token) return res.status(401).send("Access Denied.");

    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY);

        //* checking account -> is active & own account ?
        if (helper.auth_user_error(verified, req.body)) return res.status(400).send("Access Denied.");

        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send("Invalid Token.");
    }
}

function auth_post(req, res, next) {
    const token = req.header("Token");
    if (!token) return res.status(401).send("Access Denied.");

    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY);

        //* checking account -> is active account & own post ?
        if (helper.auth_post_error(verified, req.body)) return res.status(400).send("Access Denied.");

        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send("Invalid Token.");
    }
}

function auth_post_verified(req, res, next) {
    const token = req.header("Token");
    if (!token) return res.status(401).send("Access Denied.");

    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY);

        //* checking account -> is active & verified account & own post
        if (helper.auth_post_verified_error(verified, req.body)) return res.status(400).send("Access Denied.");

        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send("Invalid Token.");
    }
}

module.exports = {
    auth,
    auth_user,
    auth_post,
    auth_post_verified
}