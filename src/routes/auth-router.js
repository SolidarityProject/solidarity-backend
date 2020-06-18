const express = require("express");
const User = require("../schemas/user");
const { registerValidation } = require("../utils/validations/auth-validation");
const bcrypt = require("bcrypt");

const router = express.Router();

//* register
router.post("/register", async (req, res) => {

    //* register validations (name, lastname, email, password ...)
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //* email validation (check user exists)
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist) return res.status(400).send("This email address already exists");

    //* password hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User(req.body);
    newUser.password = hashedPassword; //* password -> hashed password
    try {
        const user = await newUser.save();
        res.status(200).send({ "_id": user._id, "email": user.email });
    } catch (error) {
        res.status(500).send(error);
    }
});

//TODO: login & authentication

module.exports = router;