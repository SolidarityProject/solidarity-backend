const userRepository = require("../repositories/user-repository");
const UserNotFoundException = require("../utils/exception/user-not-found-excepiton");
const UserAlreadyExistsException = require("../utils/exception/user-already-exists-excepiton");
const WrongPasswordException = require("../utils/exception/wrong-password-exception");
const { passwordComparing, passwordHashing } = require("../helpers/password-helper");

async function isExistsWithId(id) {
  const isExists = await userRepository.isExistsWithId(id);
  if (!isExists) throw new UserNotFoundException("id", id);
}

async function isExistsWithUsername(username) {
  const isExists = await userRepository.isExistsWithUsername(username);
  if (!isExists) throw new UserNotFoundException("username", username);
}

async function isAlreadyExistsWithEmail(email) {
  const isAlreadyExists = await userRepository.isExistsWithEmail(email);
  if (isAlreadyExists) throw new UserAlreadyExistsException("email", email);
}

async function isAlreadyExistsWithUsername(username) {
  const isAlreadyExists = await userRepository.isExistsWithUsername(username);
  if (isAlreadyExists) throw new UserAlreadyExistsException("username", username);
}

async function isCorrectPassword(unencrypted, encrypted) {
  const isCorrect = await passwordComparing(unencrypted, encrypted);
  if (!isCorrect) throw new WrongPasswordException();
}

async function getById(id) {
  await isExistsWithId(id);
  return await userRepository.getById(id);
}

async function getByUsername(username) {
  await isExistsWithUsername(username);
  return await userRepository.getByUsername(username);
}

async function changePassword(userToChangePassword) {
  const user = await getById(userToChangePassword._id);

  await isCorrectPassword(userToChangePassword.oldPassword, user.password);

  const hashedPassword = await passwordHashing(userToChangePassword.newPassword);
  user.password = hashedPassword;
  await userRepository.updateUser(user._id, user);
}

async function updateUser(id, userToUpdate) {
  await isExistsWithId(id);
  const user = await getById(id);

  if (user.email != userToUpdate.email) await isAlreadyExistsWithEmail(userToUpdate.email);
  if (user.username != userToUpdate.username) await isAlreadyExistsWithUsername(userToUpdate.username);

  await userRepository.updateUser(id, userToUpdate);
}

async function deleteUser(id) {
  await isExistsWithId(id);
  await userRepository.deleteUser(id);
}

module.exports = {
  getById,
  getByUsername,
  changePassword,
  updateUser,
  deleteUser,
};
