const express = require("express");
const authController = require("../controllers/auth-controller");
const middleware = require("../middlewares/auth");

const router = express.Router();

//* register
router.post("/register", authController.register);

//* login
router.post("/login", authController.login);

//* change password request
router.post("/password-request", authController.changePasswordRequest);

//TODO : PATCH - change password - auth
//* change password
router.post("/:userId/password", middleware.change_password, authController.changePassword);

//* check available email
router.post("/available-email", authController.checkAvailableEmail);

//* check available username
router.post("/available-username", authController.checkAvailableUsername);

module.exports = router;
