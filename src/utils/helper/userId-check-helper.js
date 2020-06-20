
//* checking user for authorization (exp. -> update own info, delete own account, edit own post, etc)

module.exports = function userIdCheck(req, res, userId) {
    if (req.user._id != userId) return res.status(400).send("Access Denied.");
}