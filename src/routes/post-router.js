const express = require("express");
const Post = require("../schemas/post");
const { verifyToken } = require("../utils/security/token");
const { addPostValidation, updatePostValidation } = require("../utils/validation/post-validation");
const checkUser = require("../utils/helper/userId-check-helper");

const router = express.Router();

//* getbyid
router.get("/getbyid/:postId", verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId); //TODO : activeStatus == true
        res.status(200).send(post);
    } catch (error) {
        res.status(500).send(error);
    }
})

//* getbyuserid
router.get("/getbyuserid/:userId", verifyToken, async (req, res) => {
    try {
        const post = await Post.find({ userId: req.params.userId });
        res.status(200).send(post);
    } catch (error) {
        res.status(500).send(error);
    }
})

//* getbyfulladdress
router.get("/getbyfulladdress", verifyToken, async (req, res) => {
    try {
        const posts = await Post.find({ fullAddress: req.query.fa }).sort("dateSolidarity");
        res.status(200).send(posts);
    } catch (error) {
        res.status(500).send(error);
    }
})

//* getbyprovinceaddress
router.get("/getbyprovinceaddress", verifyToken, async (req, res) => {
    try {
        const posts = await Post.find({ provinceAddress: req.query.pa }).sort("dateSolidarity");
        res.status(200).send(posts);
    } catch (error) {
        res.status(500).send(error);
    }
})

//* getbyprovinceaddress for free user (with token-less)
router.get("/free/getbyprovinceaddress", async (req, res) => {
    try {
        const posts = await Post.find({ provinceAddress: req.query.pa }).sort("dateSolidarity").limit(3);
        res.status(200).send(posts);
    } catch (error) {
        res.status(500).send(error);
    }
})

//* add
router.post("/add", verifyToken, async (req, res) => {

    //* add validations (title, description, picture, address, dateSolidarity)
    const { error } = addPostValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const newPost = new Post(req.body);
    newPost.userId = req.user._id;
    generateAddress(newPost);
    try {
        const post = await newPost.save();
        res.status(200).send(post);
    } catch (error) {
        res.status(500).send(error);
    }
})

//* update
router.put("/update", verifyToken, async (req, res) => {

    //* checking user for authorization 
    checkUser(req, res, req.body.userId); 

    //* update validations (_id, title, description, picture ... all property)
    const { error } = updatePostValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        generateAddress(req.body);
        const post = await Post.findByIdAndUpdate(req.body._id, req.body, { new: true });
        res.status(200).send(post);
    } catch (error) {
        res.status(500).send(error);
    }
})

//* delete
router.delete("/delete", verifyToken, async (req, res) => {

    //* checking user for authorization 
    checkUser(req, res, res.body.userId);

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