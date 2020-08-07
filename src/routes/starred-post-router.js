const express = require("express");
const StarredPost = require("../models/starred-post");
const Post = require("../models/post");
const User = require("../models/user");
const middleware = require("../middlewares/auth");
const validation = require("../utils/validation/starred-post-validation");

const router = express.Router();

//* getmystarredposts
router.get("/getmystarredposts", middleware.auth, async (req, res) => {
  try {
    await StarredPost.find(
      { userId: req.user._id },
      async (err, starredPosts) => {
        if (err) res.status(500).send(err);

        if (starredPosts.length) {
          const myPosts = [];

          for (let index = 0; index < starredPosts.length; index++) {
            const post = await Post.findById(starredPosts[index].postId);
            myPosts.push(post._id);
          }
          res.status(200).send(myPosts);
        } else return res.status(400).send("Starred Post not found.");
      }
    );
  } catch (error) {
    res.status(500).send(error);
  }
});

//* getbyid
router.get("/getbyid/:starredPostId", middleware.auth, async (req, res) => {
  try {
    await StarredPost.findById(
      req.params.starredPostId,
      async (err, starredPost) => {
        if (err) return res.status(500).send(err);

        if (starredPost) {
          const user = await User.findById(starredPost.userId);
          const post = await Post.findById(starredPost.postId);
          res
            .status(200)
            .send({ _id: starredPost._id, user: user, post: post });
        } else return res.status(400).send("Starred Post not found.");
      }
    );
  } catch (error) {
    res.status(500).send(error);
  }
});

//* getbyuserid
router.get("/getbyuserid/:userId", middleware.auth, async (req, res) => {
  try {
    await StarredPost.find(
      { userId: req.params.userId },
      async (err, starredPosts) => {
        if (err) res.status(500).send(err);

        if (starredPosts.length) {
          const posts = [];

          for (let index = 0; index < starredPosts.length; index++) {
            const post = await Post.findById(starredPosts[index].postId);
            posts.push(post);
          }
          res.status(200).send(posts);
        } else return res.status(400).send("Starred Post not found.");
      }
    );
  } catch (error) {
    res.status(500).send(error);
  }
});

//* getbypostid
router.get("/getbypostid/:postId", middleware.auth, async (req, res) => {
  try {
    await StarredPost.find(
      { postId: req.params.postId },
      async (err, starredPosts) => {
        if (err) return res.status(500).send(err);

        if (starredPosts.length) {
          const users = [];

          for (let index = 0; index < starredPosts.length; index++) {
            const user = await User.findById(starredPosts[index].userId);
            users.push(user);
          }
          res.status(200).send(users);
        } else return res.status(400).send("Starred Post not found.");
      }
    );
  } catch (error) {
    res.status(500).send(error);
  }
});

//* add
router.post("/add", middleware.auth, async (req, res) => {
  //* add validations (postId)
  const { error } = validation.addStarredPostValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const newStarredPost = new StarredPost(req.body);
  newStarredPost.userId = req.user._id;
  try {
    await StarredPost.findOne(
      {
        userId: newStarredPost.userId,
        postId: newStarredPost.postId,
      },
      async (err, starredPost) => {
        if (err) return res.status(500).send(err);

        if (!starredPost) {
          const starredPost = await newStarredPost.save();
          res.status(200).send(starredPost);
        } else return res.status(400).send("This post already starred.");
      }
    );
  } catch (error) {
    res.status(500).send(error);
  }
});

//* delete
router.delete("/delete/:postId", middleware.auth, async (req, res) => {

  try {
    await StarredPost.findOneAndDelete(
      {
        userId: req.user._id,
        postId: req.params.postId,
      },
      async (err, starredPost) => {
        if (err) return res.status(500).send(err);

        if (starredPost) res.status(200).send(starredPost);
        else return res.status(400).send("Starred Post not found.");
      }
    );
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
