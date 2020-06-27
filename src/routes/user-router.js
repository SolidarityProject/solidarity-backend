const express = require("express");
const User = require("../schemas/user");
const { verifyToken } = require("../utils/security/token");
const { updateUserValidation, deleteUserValidation, changePasswordValidation } = require("../utils/validation/user-validation");
const { passwordComparing, passwordHashing } = require("../utils/helper/password-helper");

const router = express.Router();

//* getbyid
router.get("/getbyid/:userId", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
})

//* getbyusername 
router.get("/getbyusername/:username", verifyToken, async (req, res) => {
    try {
        const user = await User.find({ username: req.params.username, activeStatus: true });
        res.status(200).send(user);
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

//* changepassword  
router.put("/changepassword", verifyToken, async (req, res) => {

    //* change password validations (_id, oldPassword, newPassword )
    const { error } = changePasswordValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //* checking user for authorization (is own account ?)
    if (req.user._id != req.body._id) return res.status(400).send("Access Denied.");

    //* finding user
    const findUser = await User.findById(req.body._id);

    //* old password comparing
    const validPassword = await passwordComparing(req.body.oldPassword, findUser.password);
    if (!validPassword) return res.status(400).send("Check your old password.");

    //* new password hashing
    const hashedPassword = await passwordHashing(req.body.newPassword);
    findUser.password = hashedPassword;

    try {
        const user = await findUser.save();
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