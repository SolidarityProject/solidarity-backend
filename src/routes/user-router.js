const express = require("express");
const User = require("../schemas/user");

const router = express.Router();

//* getbyid
router.get("/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        res.send(user);
    } catch (err) {
        res.send({ message: err });
    }
})

//* update  
router.put("/", async (req, res) => { //TODO : validations
    try {
        const updatedUser = await User.findByIdAndUpdate(req.body._id, req.body, { new: true });
        res.send(updatedUser);
    } catch (err) {
        res.send({ message: err });
    }
})

//* delete
router.delete("/", async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.body._id, { $set: { "activeStatus": false, } }, { new: true });
        res.send(updatedUser);
    } catch (err) {
        res.send({ message: err });
    }
})

module.exports = router;