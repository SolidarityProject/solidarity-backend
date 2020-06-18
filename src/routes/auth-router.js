const express = require("express");
const User = require("../schemas/user");
const { registerValidation } = require("../utils/validations/auth-validation");

const router = express.Router();

//* register
router.post("/register", async (req, res) => {
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const newUser = new User(req.body);
    try {
        const user = await newUser.save();
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

//TODO: login & authentication

module.exports = router;