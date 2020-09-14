const express = require("express");
const Post = require("../models/post");
const User = require("../models/user");
const middleware = require("../middlewares/auth");
const validation = require("../utils/validation/post-validation");
const { getDateForCheck_minute } = require("../helpers/date-helper");
const { detailPostDTO } = require("../models/dtos/detail-post-dto");

const router = express.Router();

//* get by id
router.get("/:postId", middleware.auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    res.status(200).send(post);
  } catch (error) {
    res.status(500).send(error);
  }
});

//* get details by id
router.get("/:postId/details", middleware.auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    const user = await User.findById(post.userId);
    const detailPost = detailPostDTO(post, user);

    res.status(200).send(detailPost);
  } catch (error) {
    res.status(500).send(error);
  }
});

//* get by user id
router.get("/u/:userId", middleware.auth, async (req, res) => {
  try {
    const post = await Post.find({
      userId: req.params.userId,
      activeStatus: true,
    });
    res.status(200).send(post);
  } catch (error) {
    res.status(500).send(error);
  }
});

//* get by district address
router.get("/district/:districtId", middleware.auth, async (req, res) => {
  try {
    const posts = await Post.find({
      "address.districtId": req.params.districtId,
      activeStatus: true,
      dateSolidarity: { $gt: getDateForCheck_minute(15) },
    }).sort("dateSolidarity");
    res.status(200).send(posts);
  } catch (error) {
    res.status(500).send(error);
  }
});

//* get by province address
router.get("/province/:provinceId", middleware.auth, async (req, res) => {
  try {
    const posts = await Post.find({
      "address.provinceId": req.params.provinceId,
      activeStatus: true,
      dateSolidarity: { $gt: getDateForCheck_minute(15) },
    }).sort("dateSolidarity");
    res.status(200).send(posts);
  } catch (error) {
    res.status(500).send(error);
  }
});

//* get by province address for free user (not required token)
router.get("/free/:provinceId", async (req, res) => {
  try {
    const posts = await Post.find({
      "address.provinceId": req.params.provinceId,
      activeStatus: true,
      dateSolidarity: { $gt: getDateForCheck_minute(15) },
    })
      .sort("dateSolidarity")
      .limit(3);
    res.status(200).send(posts);
  } catch (error) {
    res.status(500).send(error);
  }
});

//* add
router.post("/", middleware.auth_post_verified, async (req, res) => {
  //* add validations (title, description, picture, address, dateSolidarity)
  const { error } = validation.addPostValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const newPost = new Post(req.body);
  newPost.userId = req.user._id;
  try {
    const post = await newPost.save();
    res.status(200).send(post);
  } catch (error) {
    res.status(500).send(error);
  }
});

//* update
router.put("/", middleware.auth_post, async (req, res) => {
  //* update validations (_id, title, description, picture ... all property)
  const { error } = validation.updatePostValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const post = await Post.findByIdAndUpdate(req.body._id, req.body, {
      new: true,
    });
    res.status(200).send(post);
  } catch (error) {
    res.status(500).send(error);
  }
});

//* delete
router.delete("/", middleware.auth_post, async (req, res) => {
  //* delete validations (_id, userId)
  const { error } = validation.deletePostValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const post = await Post.findByIdAndUpdate(
      req.body._id,
      { $set: { activeStatus: false } },
      { new: true }
    );
    res.status(200).send(post);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
