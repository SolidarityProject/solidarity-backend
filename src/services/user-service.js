const User = require("../models/user");
const { passwordHashing } = require("../helpers/password-helper");

async function getById(id) {
  return await User.findById(id);
}

async function getByUsername(username) {
  return await User.findOne({ username: username, activeStatus: true });
}

async function isExistsEmail(emailToCheck) {
  await User.exists({ email: emailToCheck });
}

async function isExistsUsername(usernameToCheck) {
  await User.exists({ username: usernameToCheck });
}

async function changePassword(user, newPassword) {
  const hashedPassword = await passwordHashing(newPassword);
  user.password = hashedPassword;
  await user.save();
}

async function updateUser(id, userToUpdate) {
  await User.findByIdAndUpdate(id, userToUpdate);
}

async function deleteUser(id) {
  await User.findByIdAndUpdate(id, { $set: { activeStatus: false } });
}

module.exports = {
  getById,
  getByUsername,
  isExistsEmail,
  isExistsUsername,
  changePassword,
  updateUser,
  deleteUser,
};
