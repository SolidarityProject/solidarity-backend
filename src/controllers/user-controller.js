const userService = require("../services/user-service");
const validation = require("../utils/validation/user-validation");
const { passwordComparing } = require("../helpers/password-helper");

exports.getMyInfo = async (req, res) => {
  try {
    const user = await userService.getById(req.user._id);
    if (!user) {
      return res.status(404).send("User not found.");
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getById = async (req, res) => {
  try {
    const user = await userService.getById(req.params.userId);
    if (!user) {
      return res.status(404).send("User not found.");
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getByUsername = async (req, res) => {
  try {
    const user = await userService.getByUsername(req.params.username);
    if (!user) {
      return res.status(404).send("User not found.");
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.updateUser = async (req, res) => {
  try {
    //* update validations (_id, name, lastname ... all property)
    const { error } = validation.updateUserValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await userService.getById(req.user._id);
    if (!user) {
      return res.status(404).send("User not found.");
    }

    if (user.email != req.body.email) {
      //* email validation (check mail exists)
      const userExist_email = await userService.isExistsEmail(req.body.email);
      if (userExist_email) return res.status(400).send("This email address already exists.");
    }

    if (user.username != req.body.username) {
      //* username validation (check username exists)
      const userExist_username = await userService.isExistsUsername(req.body.username);
      if (userExist_username) return res.status(400).send("This username already exists.");
    }

    await userService.updateUser(req.user._id, req.body);
    res.status(204).send();
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// TODO : PATCH - change password
exports.changePassword = async (req, res) => {
  try {
    //* change password validations (_id, oldPassword, newPassword )
    const { error } = validation.changePasswordValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //* finding user
    const user = await userService.getById(req.body._id);
    if (!user) {
      return res.status(404).send("User not found.");
    }

    //* old password comparing
    const validPassword = await passwordComparing(req.body.oldPassword, user.password);
    if (!validPassword) return res.status(400).send("Check your old password.");

    await userService.changePassword(user, req.body.newPassword);
    res.status(204).send();
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    //* delete validations (_id)
    const { error } = validation.deleteUserValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    await userService.deleteUser(req.body._id);
    res.status(204).send();
  } catch (error) {
    res.status(500).send(error.message);
  }
};
