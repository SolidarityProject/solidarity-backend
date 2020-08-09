const express = require("express");
const StarredPost = require("../models/starred-post");
const Post = require("../models/post");
const User = require("../models/user");
const middleware = require("../middlewares/auth");
const validation = require("../utils/validation/starred-validation");

const router = express.Router();

//* getmystarredposts
router.get("/getmystarredposts", middleware.auth, async (req, res) => {
  try {
    await User.findById(req.user._id, async (err, user) => {
      if (err) res.status(500).send(err);

      if (user) res.status(200).send(user.starredPosts);
      else return res.status(400).send("User not found.");
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

//* getusersbypostid
router.get("/getusersbypostid/:postId", middleware.auth, async (req, res) => {
  try {
    await Post.findById(req.params.postId, async (err, post) => {
      if (err) res.status(500).send(err);

      if (post) res.status(200).send(post.starredUsers);
      else return res.status(400).send("Post not found.");
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

//* getpostsbyuserid
router.get("/getpostsbyuserid/:userId", middleware.auth, async (req, res) => {
  try {
    await User.findById(req.params.userId, async (err, user) => {
      if (err) res.status(500).send(err);

      if (user) {
        const posts = [];

        for (let index = 0; index < user.starredPosts.length; index++) {
          const post = await Post.findById(user.starredPosts[index]);
          posts.push(post);
        }
        res.status(200).send(posts);
      } else return res.status(400).send("User not found.");
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

//* getusersinfobypostid
router.get(
  "/getusersinfobypostid/:postId",
  middleware.auth,
  async (req, res) => {
    try {
      await Post.findById(req.params.postId, async (err, post) => {
        if (err) res.status(500).send(err);

        if (post) {
          const users = [];

          for (let index = 0; index < post.starredUsers.length; index++) {
            const user = await User.findById(post.starredUsers[index]);
            users.push(user);
          }
          res.status(200).send(users);
        } else return res.status(400).send("Post not found.");
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

//* add
router.post("/add", middleware.auth, async (req, res) => {
  //* add validations (postId)
  const { error } = validation.addStarredPostValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    await User.findById(req.user._id, async (err, user) => {
      if (err) return res.status(500).send(err);

      if (user) {
        const existStatus = user.starredPosts.includes(req.body.postId);
        if (existStatus)
          return res.status(400).send("This post already starred.");

        user.starredPosts.push(req.body.postId);
        await user.save();
        res.status(200).send(user.starredPosts);
      } else return res.status(400).send("User not found.");
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

//* delete
router.delete("/delete/:postId", middleware.auth, async (req, res) => {
  try {
    await User.findById(req.user._id, async (err, user) => {
      if (err) return res.status(500).send(err);

      if (user) {
        const existStatus = user.starredPosts.includes(req.params.postId);
        if (!existStatus) return res.status(400).send("This post non starred.");

        user.starredPosts.pop(req.params.postId);
        await user.save();
        res.status(200).send(user.starredPosts);
      } else return res.status(400).send("User not found.");
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
