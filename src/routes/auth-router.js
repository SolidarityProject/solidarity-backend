const express = require("express");
const User = require("../schemas/user");
const { registerValidation, loginValidation } = require("../utils/validation/auth-validation");
const { passwordHashing, passwordComparing } = require("../utils/helper/password-helper");
const { createToken } = require("../utils/security/token");

const router = express.Router();

//* register
router.post("/register", async (req, res) => {

    //* register validations (name, lastname, email, password, gender, birthdate)
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //* email validation (check user exists)
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist) return res.status(400).send("This email address already exists.");

    //* password hashing
    const hashedPassword = await passwordHashing(req.body.password);

    const newUser = new User(req.body);
    newUser.password = hashedPassword; //* password -> hashed password
    try {
        const user = await newUser.save();
        res.status(200).send({ "_id": user._id, "email": user.email });
    } catch (error) {
        res.status(500).send(error);
    }
});

//* login
router.post("/login", async (req, res) => {

    //* login validations (email & password)
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //* email validation (check user)
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Check your email or password.");

    //* password comparing
    const validPassword = await passwordComparing(req.body.password, user.password);
    if (!validPassword) return res.status(400).send("Check your email or password.");

    //* create token (1h) 
    // TODO : refreshtoken
    const token = createToken(user);

    res.setHeader("Token", token);
    res.status(200).send({ token: token });
});

//TODO: edit authentication -> getfulladdress ?? user_update ??

module.exports = router;