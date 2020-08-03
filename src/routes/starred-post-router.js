const express = require("express");
const StarredPost = require("../models/starred-post");
const Post = require("../models/post");
const User = require("../models/user");
const middleware = require("../middlewares/auth");

const router = express.Router();

//* getbyid
router.get("/getbyid/:starredPostId", middleware.auth, async (req, res) => {
  try {
    const starredPost = await StarredPost.findById(req.params.starredPostId);
    const user = await User.findById(starredPost.userId);
    const post = await Post.findById(starredPost.postId);
    res.status(200).send({ user: user, post: post });
  } catch (error) {
    res.status(500).send(error);
  }
});

//* getbyuserid
router.get("/getbyuserid/:userId", middleware.auth, async (req, res) => {
  try {
    const starredPosts = await StarredPost.find({ userId: req.params.userId });
    const posts = [];

    for (let index = 0; index < starredPosts.length; index++) {
      const post = await Post.findById(starredPosts[index].postId);
      posts.push(post);
    }
    res.status(200).send(posts);
  } catch (error) {
    res.status(500).send(error);
  }
});

//* getbypostid
router.get("/getbypostid/:postId", async (req, res) => {
  try {
    const starredPosts = await StarredPost.find({ postId: req.params.postId });
    const users = [];

    for (let index = 0; index < starredPosts.length; index++) {
      const user = await User.findById(starredPosts[index].userId);
      users.push(user);
    }
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

// TODO : validation - middleware

//* add
router.post("/add", middleware.auth, async (req, res) => {
  //* add validations (title, description, picture, address, dateSolidarity)
  //const { error } = addPostValidation(req.body);
  // if (error) return res.status(400).send(error.details[0].message);

  const newStarredPost = new StarredPost(req.body);
  newStarredPost.userId = req.user._id;
  try {
    const starredPost = await newStarredPost.save();
    res.status(200).send(starredPost);
  } catch (error) {
    res.status(500).send(error);
  }
});

//* delete
router.delete("/delete", middleware.auth, async (req, res) => {
  //* delete validations (_id, userId)
  //const { error } = deletePostValidation(req.body);
  //if (error) return res.status(400).send(error.details[0].message);

  try {
    const starredPost = await StarredPost.findOneAndDelete({
      userId: req.user._id,
      postId: req.body.postId,
    });
    res.status(200).send(starredPost);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
