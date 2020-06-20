const express = require("express");
const User = require("../schemas/user");
const { verifyToken } = require("../utils/security/token");
const { updateUserValidation, deleteUserValidation } = require("../utils/validation/user-validation");

const router = express.Router();

//* getbyid
router.get("/getbyid/:userId", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        res.status(200).send(user); // TODO: dto ?? research (show -> name, email, picture, etc  XXX  don't show -> password, address)
    } catch (error) {
        res.status(500).send(error);
    }
})

//* update  
router.put("/update", verifyToken, async (req, res) => {

    //* update validations (_id, name, lastname ... all property)
    const { error } = updateUserValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //* checking user for authorization (is own account ?)
    if (req.user._id != req.body._id) return res.status(400).send("Access Denied.");

    try {
        const user = await User.findByIdAndUpdate(req.body._id, req.body, { new: true });
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
})

//* delete
router.delete("/delete", verifyToken, async (req, res) => {

    //* delete validations (_id)
    const { error } = deleteUserValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //* checking user for authorization (is own account ?)
    if (req.user._id != req.body._id) return res.status(400).send("Access Denied.");

    try {
        const user = await User.findByIdAndUpdate(req.body._id, { $set: { "activeStatus": false, } }, { new: true });
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = router;