const userRepository = require("../repositories/user-repository");
const User = require("../models/user");
const LoginException = require("../utils/exception/login-excepiton");
const UserNotFoundException = require("../utils/exception/user-not-found-excepiton");
const UserAlreadyExistsException = require("../utils/exception/user-already-exists-excepiton");
const WrongPasswordCodeException = require("../utils/exception/wrong-password-code-exception");
const { passwordComparing, passwordHashing } = require("../helpers/password-helper");
const { createToken, createToken_changePassword } = require("../utils/security/token");
const { generatePasswordCode } = require("../helpers/password-code-helper");

async function isExistsWithId(id) {
  const isExists = await userRepository.isExistsWithId(id);
  if (!isExists) throw new UserNotFoundException("id", id);
}

async function isExistsWithEmail(email) {
  const isExists = await userRepository.isExistsWithEmail(email);
  if (!isExists) throw new UserNotFoundException("email", email);
}

async function isAlreadyExistsWithEmail(email) {
  const isAlreadyExists = await userRepository.isExistsWithEmail(email);
  if (isAlreadyExists) throw new UserAlreadyExistsException("email", email);
}

async function isAlreadyExistsWithUsername(username) {
  const isAlreadyExists = await userRepository.isExistsWithUsername(username);
  if (isAlreadyExists) throw new UserAlreadyExistsException("username", username);
}

async function isCorrectEmail(email) {
  const isCorrect = await userRepository.isExistsWithEmail(email);
  if (!isCorrect) throw new LoginException();
}

async function isCorrectPassword(unencrypted, encrypted) {
  const isCorrect = await passwordComparing(unencrypted, encrypted);
  if (!isCorrect) throw new LoginException();
}

async function getById(id) {
  await isExistsWithId(id);
  return await userRepository.getById(id);
}

async function getByEmail(email) {
  await isExistsWithEmail(email);
  return await userRepository.getByEmail(email);
}

async function getByEmailForLogin(email) {
  await isCorrectEmail(email);
  return await userRepository.getByEmail(email);
}

async function register(userToRegister) {
  await isAlreadyExistsWithEmail(userToRegister.email);
  await isAlreadyExistsWithUsername(userToRegister.username);

  const hashedPassword = await passwordHashing(userToRegister.password);

  const newUser = new User(userToRegister);
  newUser.password = hashedPassword;

  await userRepository.addUser(newUser);
  return newUser._id;
}

async function login(userToLogin) {
  const user = await getByEmailForLogin(userToLogin.email);
  await isCorrectPassword(userToLogin.password, user.password);

  //* checking active status
  if (!user.activeStatus) {
    user.activeStatus = true; // user not active ?? -> user active now
    await userRepository.updateUser(user._id, user); // update & save db
  }

  //* create token  // TODO : refreshtoken
  return createToken(user);
}

async function changePasswordRequest(changePasswordRequest) {
  //* find user
  const user = await getByEmail(changePasswordRequest.email);

  //* create token (2m)
  const token = createToken_changePassword(user.id);

  //* create random password code & save
  user.passwordRequestCode = generatePasswordCode();
  await userRepository.updateUser(user._id, user);

  return token;
}

async function changePassword(userToChangePassword) {
  //* find user
  const user = await getById(userToChangePassword._id);

  //* check password code
  if (user.passwordRequestCode != userToChangePassword.passwordRequestCode) throw new WrongPasswordCodeException();

  //* password hashing
  const hashedPassword = await passwordHashing(userToChangePassword.newPassword);

  //* update password
  user.password = hashedPassword;
  await userRepository.updateUser(user._id, user);
}

async function checkAvailableEmail(email) {
  await isAlreadyExistsWithEmail(email);
  return "Available";
}

async function checkAvailableUsername(username) {
  await isAlreadyExistsWithUsername(username);
  return "Available";
}

module.exports = {
  register,
  login,
  changePasswordRequest,
  changePassword,
  checkAvailableEmail,
  checkAvailableUsername,
};
