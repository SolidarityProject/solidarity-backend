const express = require("express");
const Post = require("../schemas/post");

const router = express.Router();

//* getbyid
router.get("/getbyid/:postId", async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId); //TODO : activeStatus == true
        res.send(post);
    } catch (err) {
        res.send({ message: err });
    }
})

//* getbyuserid
router.get("/getbyuserid/:userId", async (req, res) => {
    try {
        const post = await Post.find({ userId: req.params.userId });
        res.send(post);
    } catch (err) {
        res.send({ message: err });
    }
})

//* getbyfulladdress
router.get("/getbyfulladdress", async (req, res) => {
    try {
        const posts = await Post.find({ fullAddress: req.query.fa });
        res.send(posts);
    } catch (err) {
        res.send({ message: err });
    }
})

//* getbyprovinceaddress
router.get("/getbyprovinceaddress", async (req, res) => {
    try {
        const posts = await Post.find({ provinceAddress: req.query.pa });
        res.send(posts);
    } catch (err) {
        res.send({ message: err });
    }
})

//* add
router.post("/add", async (req, res) => {
    const newPost = new Post(req.body);
    generateAddress(newPost);
    try {
        const post = await newPost.save();
        res.send(post);
    } catch (error) {
        res.send({ message: error });
    }
})

//* update
router.put("/update", async (req, res) => {
    try {
        generateAddress(req.body);
        const post = await Post.findByIdAndUpdate(req.body._id, req.body, { new: true });
        res.send(post);
    } catch (error) {
        res.send({ message: error });
    }
})

//* delete
router.delete("/delete", async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.body._id, { $set: { "activeStatus": false, } }, { new: true });
        res.send(post);
    } catch (err) {
        res.send({ message: err });
    }
})

// generate province & full address functions
function generateAddress(postSchema) {
    postSchema.provinceAddress = postSchema.address.province + "-" + postSchema.address.country;
    postSchema.fullAddress = postSchema.address.district + "-" + postSchema.address.province + "-" + postSchema.address.country;
};

module.exports = router;