const User = require("../models/user");

async function isExistsWithId(idToCheck) {
  return await User.exists({ _id: idToCheck });
}

async function isExistsWithEmail(emailToCheck) {
  return await User.exists({ email: emailToCheck, activeStatus: true });
}

async function isExistsWithUsername(usernameToCheck) {
  return await User.exists({ username: usernameToCheck, activeStatus: true });
}

async function isActiveWithId(idToCheck) {
  return await User.exists({ _id: idToCheck, activeStatus: true });
}

async function getById(id) {
  return await User.findById(id);
}

async function getByEmail(email) {
  return await User.findOne({ email: email, activeStatus: true });
}

async function getByUsername(username) {
  return await User.findOne({ username: username, activeStatus: true });
}

async function addUser(userToAdd) {
  await userToAdd.save(); // TODO : research add user funct
}

async function saveUser(userToSave) {
  await userToSave.save();
}

async function updateUser(id, userToUpdate) {
  await User.findByIdAndUpdate(id, userToUpdate);
}

async function deleteUser(id) {
  await User.findByIdAndUpdate(id, { $set: { activeStatus: false } });
}

module.exports = {
  isExistsWithId,
  isExistsWithEmail,
  isExistsWithUsername,
  isActiveWithId,
  getById,
  getByEmail,
  getByUsername,
  addUser,
  saveUser,
  updateUser,
  deleteUser,
};
