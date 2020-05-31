const express = require("express");
const User = require("../schemas/user");

const router = express.Router();

//* register
router.post("/register", async (req, res) => {
    const newUser = new User(req.body);
    try {
        const user = await newUser.save();
        res.send(user); //TODO: status code 
    } catch (error) {
        res.send({ message: error })
    }
});

//TODO: login & authentication

module.exports = router;