const express = require("express");
const Post = require("../schemas/post");

const router = express.Router();

//* getbyid
router.get("/getbyid/:postId", async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId); //TODO : activeStatus == true
        res.status(200).send(post);
    } catch (error) {
        res.status(500).send(error);
    }
})

//* getbyuserid
router.get("/getbyuserid/:userId", async (req, res) => {
    try {
        const post = await Post.find({ userId: req.params.userId });
        res.status(200).send(post);
    } catch (error) {
        res.status(500).send(error);
    }
})

//* getbyfulladdress
router.get("/getbyfulladdress", async (req, res) => {
    try {
        const posts = await Post.find({ fullAddress: req.query.fa });
        res.status(200).send(posts);
    } catch (error) {
        res.status(500).send(error);
    }
})

//* getbyprovinceaddress
router.get("/getbyprovinceaddress", async (req, res) => {
    try {
        const posts = await Post.find({ provinceAddress: req.query.pa });
        res.status(200).send(posts);
    } catch (error) {
        res.status(500).send(error);
    }
})

//* add
router.post("/add", async (req, res) => {
    const newPost = new Post(req.body);
    generateAddress(newPost);
    try {
        const post = await newPost.save();
        res.status(200).send(post);
    } catch (error) {
        res.status(500).send(error);
    }
})

//* update
router.put("/update", async (req, res) => {
    try {
        generateAddress(req.body);
        const post = await Post.findByIdAndUpdate(req.body._id, req.body, { new: true });
        res.status(200).send(post);
    } catch (error) {
        res.status(500).send(error);
    }
})

//* delete
router.delete("/delete", async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.body._id, { $set: { "activeStatus": false, } }, { new: true });
        res.status(200).send(post);
    } catch (err) {
        res.status(500).send(error);
    }
})

// generate province & full address functions
function generateAddress(postSchema) {
    postSchema.provinceAddress = postSchema.address.province + "-" + postSchema.address.country;
    postSchema.fullAddress = postSchema.address.district + "-" + postSchema.address.province + "-" + postSchema.address.country;
};

module.exports = router;