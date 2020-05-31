const express = require("express");
const User = require("../schemas/user");

const router = express.Router();

//* register
router.post("/register", async (req, res) => {
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