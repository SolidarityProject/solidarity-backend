const express = require("express");
const User = require("../schemas/user");
const { registerValidation } = require("../utils/validations/auth-validation");

const router = express.Router();

//* register
router.post("/register", async (req, res) => {
    const { error } = registerValidation(req.body);  //* register validations (name, lastname, email, password ...)
    if (error) return res.status(400).send(error.details[0].message);

    const userExist = await User.findOne({ email: req.body.email }); //* email validation (check user exists)
    if (userExist) return res.status(400).send("This email address already exists");

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