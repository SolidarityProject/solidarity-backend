const express = require("express");
const Post = require("../models/post");
const middleware = require("../middlewares/auth");
const validation = require("../utils/validation/post-validation");
const { getDateForCheck_minute } = require("../helpers/date-helper");

const router = express.Router();

//* getbyid
router.get("/getbyid/:postId", middleware.auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    res.status(200).send(post);
  } catch (error) {
    res.status(500).send(error);
  }
});

//* getbyuserid
router.get("/getbyuserid/:userId", middleware.auth, async (req, res) => {
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

//* getbyfulladdress
router.get(
  "/getbyfulladdress/:districtId",
  middleware.auth,
  async (req, res) => {
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
  }
);

//* getbyprovinceaddress
router.get(
  "/getbyprovinceaddress/:provinceId",
  middleware.auth,
  async (req, res) => {
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
  }
);

//* getbyprovinceaddress for free user (not required token)
router.get("/free/getbyprovinceaddress/:provinceId", async (req, res) => {
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
router.post("/add", middleware.auth_post_verified, async (req, res) => {
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
router.put("/update", middleware.auth_post, async (req, res) => {
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
router.delete("/delete", middleware.auth_post, async (req, res) => {
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
