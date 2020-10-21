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

module.exports = router;
