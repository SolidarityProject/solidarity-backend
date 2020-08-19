const express = require("express");
const User = require("../models/user");
const middleware = require("../middlewares/auth");
const validation = require("../utils/validation/user-validation");
const {
  passwordComparing,
  passwordHashing,
} = require("../helpers/password-helper");

const router = express.Router();

//* me
router.get("/me", middleware.auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

//* getbyid
router.get("/getbyid/:userId", middleware.auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

//* getbyusername
router.get("/getbyusername/:username", middleware.auth, async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.params.username,
      activeStatus: true,
    });
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

//* update
router.put("/update", middleware.auth_user, async (req, res) => {
  //* update validations (_id, name, lastname ... all property)
  const { error } = validation.updateUserValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.user._id);

  if (user.email != req.body.email) {
    //* email validation (check mail exists)
    const userExist_email = await User.exists({ email: req.body.email });
    if (userExist_email)
      return res.status(400).send("This email address already exists.");
  }

  if (user.username != req.body.username) {
    //* username validation (check username exists)
    const userExist_username = await User.exists({
      username: req.body.username,
    });
    if (userExist_username)
      return res.status(400).send("This username already exists.");
  }

  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    });
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

//* changepassword
router.put("/changepassword", middleware.auth_user, async (req, res) => {
  //* change password validations (_id, oldPassword, newPassword )
  const { error } = validation.changePasswordValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //* finding user
  const findUser = await User.findById(req.body._id);

  //* old password comparing
  const validPassword = await passwordComparing(
    req.body.oldPassword,
    findUser.password
  );
  if (!validPassword) return res.status(400).send("Check your old password.");

  //* new password hashing
  const hashedPassword = await passwordHashing(req.body.newPassword);
  findUser.password = hashedPassword;

  try {
    const user = await findUser.save();
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

//* delete
router.delete("/delete", middleware.auth_user, async (req, res) => {
  //* delete validations (_id)
  const { error } = validation.deleteUserValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const user = await User.findByIdAndUpdate(
      req.body._id,
      { $set: { activeStatus: false } },
      { new: true }
    );
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
