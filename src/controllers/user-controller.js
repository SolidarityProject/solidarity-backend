const userService = require("../services/user-service");
const validation = require("../utils/validation/user-validation");

exports.getMyInfo = async (req, res) => {
  try {
    const user = await userService.getById(req.user._id);
    res.status(200).send(user);
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
};

exports.getById = async (req, res) => {
  try {
    const user = await userService.getById(req.params.userId);
    res.status(200).send(user);
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
};

exports.getByUsername = async (req, res) => {
  try {
    const user = await userService.getByUsername(req.params.username);
    res.status(200).send(user);
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
};

exports.updateUser = async (req, res) => {
  try {
    //* update validations (_id, name, lastname ... all property)
    const { error } = validation.updateUserValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    await userService.updateUser(req.body._id, req.body);
    res.status(204).send();
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
};

// TODO : PATCH - change password
exports.changePassword = async (req, res) => {
  try {
    //* change password validations (_id, oldPassword, newPassword )
    const { error } = validation.changePasswordValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    await userService.changePassword(req.body);
    res.status(204).send();
  } catch (error) {
    res.status(error.status || 500).send(error.message);
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
    res.status(error.status || 500).send(error.message);
  }
};
