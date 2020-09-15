const express = require("express");
const User = require("../models/user");
const validation = require("../utils/validation/auth-validation");
const { change_password } = require("../middlewares/auth");
const { generatePasswordCode } = require("../helpers/password-code-helper");
const {
  passwordHashing,
  passwordComparing,
} = require("../helpers/password-helper");
const {
  createToken,
  createToken_changePassword,
} = require("../utils/security/token");

const router = express.Router();

//* register
router.post("/register", async (req, res) => {
  //* register validations (name, lastname, email, password, gender, birthdate)
  const { error } = validation.registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //* email validation (check mail exists)
  const userExist_email = await User.findOne({ email: req.body.email });
  if (userExist_email)
    return res.status(400).send("This email address already exists.");

  //* username validation (check username exists)
  const userExist_username = await User.findOne({
    username: req.body.username,
  });
  if (userExist_username)
    return res.status(400).send("This username already exists.");

  //* password hashing
  const hashedPassword = await passwordHashing(req.body.password);

  const newUser = new User(req.body);
  newUser.password = hashedPassword; //* password -> hashed password
  try {
    const user = await newUser.save();
    res.status(200).send({ _id: user._id, email: user.email });
  } catch (error) {
    res.status(500).send(error);
  }
});

//* login
router.post("/login", async (req, res) => {
  //* login validations (email & password)
  const { error } = validation.loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //* email validation (check user)
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Check your email or password.");

  //* password comparing
  const validPassword = await passwordComparing(
    req.body.password,
    user.password
  );
  if (!validPassword)
    return res.status(400).send("Check your email or password.");

  //* checking active status
  if (!user.activeStatus) {
    user.activeStatus = true; // user not active ?? -> user active now
    await user.save(); // update & save db
  }

  //* create token (1h)
  // TODO : refreshtoken
  const token = createToken(user);

  res.setHeader("Token", token);
  res.status(200).send({ token: token });
});

//* change password request
router.post("/password-request", async (req, res) => {
  //* password request validations (email)
  const { error } = validation.passwordRequestValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //* find user
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Check your email.");

  //* create token (2m)
  const token = createToken_changePassword(user.id);

  //* create random password code & save
  user.passwordRequestCode = generatePasswordCode();
  await user.save();

  res.setHeader("Token", token);
  res.status(200).send({ token: token });
});

//TODO : PATCH - change password - auth

//* change password
router.post("/:userId/password", change_password, async (req, res) => {
  //* change password validations (_id, newPassword, passwordCode)
  const { error } = validation.changePasswordValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //* find user
  const user = await User.findById(req.body._id);

  //* check password code
  if (user.passwordRequestCode != req.body.passwordRequestCode)
    return res.status(400).send("Check your code.");

  //* password hashing
  const hashedPassword = await passwordHashing(req.body.newPassword);

  //* update password
  user.password = hashedPassword;
  await user.save();

  res.status(200).send({ _id: user._id, email: user.email });
});

//* check available email
router.post("/available-email", async (req, res) => {
  //* check available email validation (email)
  const { error } = validation.checkAvailableEmailValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const userExist_email = await User.exists({ email: req.body.email });
  if (userExist_email)
    return res.status(400).send("This email address already exists.");

  res.status(200).send("Available");
});

//* check available username
router.post("/available-username", async (req, res) => {
  //* check available username validation (username)
  const { error } = validation.checkAvailableUsernameValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const userExist_username = await User.exists({ username: req.body.username });
  if (userExist_username)
    return res.status(400).send("This username already exists.");

  res.status(200).send("Available");
});

module.exports = router;
