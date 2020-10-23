const authService = require("../services/auth-service");
const validation = require("../utils/validation/auth-validation");

exports.register = async (req, res) => {
  //* register validations (name, lastname, email, password, gender, birthdate)
  const { error } = validation.registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const userId = await authService.register(req.body);
    res.location("/api/v1/users/" + userId);
    res.status(201).send();
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
};

exports.login = async (req, res) => {
  //* login validations (email & password)
  const { error } = validation.loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const token = await authService.login(req.body);
    res.setHeader("Token", token);
    res.status(200).send({ token: token });
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
};

exports.changePasswordRequest = async (req, res) => {
  //* password request validations (email)
  const { error } = validation.passwordRequestValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const token = await authService.changePasswordRequest(req.body);
    res.setHeader("Token", token);
    res.status(200).send({ token: token });
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
};

exports.changePassword = async (req, res) => {
  //* change password validations (_id, newPassword, passwordCode)
  const { error } = validation.changePasswordValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    await authService.changePassword(req.body);
    res.status(204).send();
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
};

exports.checkAvailableEmail = async (req, res) => {
  //* check available email validation (email)
  const { error } = validation.checkAvailableEmailValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const result = await authService.checkAvailableEmail(req.body.email);
    res.status(200).send(result);
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
};

exports.checkAvailableUsername = async (req, res) => {
  //* check available username validation (username)
  const { error } = validation.checkAvailableUsernameValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const result = await authService.checkAvailableUsername(req.body.username);
    res.status(200).send(result);
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
};
