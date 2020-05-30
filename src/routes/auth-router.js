const express = require("express");
const User = require("../schemas/user");

const router = express.Router();

//* register
router.post("/register", async (req, res) => {
    const newUser = new User({
        name: req.body.name,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        gender: req.body.gender,
        birthdate: req.body.birthdate,
    })
    try {
        const registeredUser = await newUser.save();
        res.send(registeredUser); //TODO: status code 
    } catch (error) {
        res.send({ message: error })
    }
});

//TODO: login & authentication

module.exports = router;