const userRepository = require("../repositories/user-repository");
const postRepository = require("../repositories/post-repository");
const UserNotFoundException = require("../utils/exception/user-not-found-excepiton");
const UserAlreadyExistsException = require("../utils/exception/user-already-exists-excepiton");
const WrongPasswordException = require("../utils/exception/wrong-password-exception");
const PostAlreadyStarredException = require("../utils/exception/post-already-starred-excepiton");
const PostNonStarredException = require("../utils/exception/post-non-starred-excepiton");
const { passwordComparing, passwordHashing } = require("../helpers/password-helper");
const { getDateForCheck_minute } = require("../helpers/date-helper");

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

//* starred-posts

async function checkStarredStatusForAdd(starredPosts, postId) {
  if (starredPosts.includes(postId)) throw new PostAlreadyStarredException(postId);
}

async function checkStarredStatusForDelete(starredPosts, postId) {
  if (!starredPosts.includes(postId)) throw new PostNonStarredException(postId);
}

async function getMyStarredPosts(id) {
  const user = await getById(id);
  return user.starredPosts;
}

async function getStarredPostsByUserId(userId) {
  const user = await getById(userId);
  const date = getDateForCheck_minute(15);
  const starredPosts = [];

  for (const postId of user.starredPosts) {
    if (await postRepository.isExistsWithIdForStarred(postId, date)) {
      const post = await postRepository.getById(postId);
      starredPosts.push(post);
    }
  }

  return starredPosts.sort((a, b) => a.dateSolidarity - b.dateSolidarity);
}

async function addStarredPost(user, postId) {
  user.starredPosts.push(postId);
  await userRepository.saveUser(user);
}

async function deleteStarredPost(user, postId) {
  user.starredPosts.pull(postId);
  await userRepository.saveUser(user);
}

module.exports = {
  getById,
  getByUsername,
  changePassword,
  updateUser,
  deleteUser,
  checkStarredStatusForAdd,
  checkStarredStatusForDelete,
  getMyStarredPosts,
  getStarredPostsByUserId,
  addStarredPost,
  deleteStarredPost,
};
