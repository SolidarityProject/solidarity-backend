const express = require("express");
const User = require("../schemas/user");

const router = express.Router();

//* getbyid
router.get("/getbyid/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
})

//* update  
router.put("/update", async (req, res) => { //TODO : validations
    try {
        const user = await User.findByIdAndUpdate(req.body._id, req.body, { new: true });
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
})

//* delete
router.delete("/delete", async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.body._id, { $set: { "activeStatus": false, } }, { new: true });
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = router;