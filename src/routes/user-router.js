const express = require("express");
const userController = require("../controllers/user-controller");
const middleware = require("../middlewares/auth");

const router = express.Router();

//* get my info
router.get("/me/info", middleware.auth, userController.getMyInfo);

//* get by id
router.get("/:userId", middleware.auth, userController.getById);

//* get by username
router.get("/u/:username", middleware.auth, userController.getByUsername);

//* update
router.put("/", middleware.auth_user, userController.updateUser);

//* change password
router.put("/:userId/password", middleware.auth_user, userController.changePassword);

//* delete
router.delete("/", middleware.auth_user, userController.deleteUser);

//* starred-post

//* get my starred posts (only post id)
router.get("/me/starred-post", middleware.auth, userController.getMyStarredPosts);

//* get starred posts by user id
router.get("/:userId/starred", middleware.auth, userController.getStarredPostsByUserId);

//* add starred post
router.post("/:userId/starred", middleware.auth, userController.addStarredPost);

//* delete starred post
router.delete("/:userId/starred/:postId", middleware.auth, userController.deleteStarredPost);

module.exports = router;
