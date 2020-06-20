const express = require("express");
const User = require("../schemas/user");
const { verifyToken } = require("../utils/security/token");
const { userUpdateValidation, userDeleteValidation } = require("../utils/validation/user-validation");
const checkUser = require("../utils/helper/userId-check-helper");

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

    //* checking user for authorization
    checkUser(req, res, req.body._id);

    //* update validations (_id, name, lastname ... all property)
    const { error } = userUpdateValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const user = await User.findByIdAndUpdate(req.body._id, req.body, { new: true });
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
})

//* delete
router.delete("/delete", verifyToken, async (req, res) => {

    //* checking user for authorization
    checkUser(req, res, req.body._id);

    //* delete validations (_id)
    const { error } = userDeleteValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const user = await User.findByIdAndUpdate(req.body._id, { $set: { "activeStatus": false, } }, { new: true });
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = router;