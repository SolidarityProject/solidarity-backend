const postRepository = require("../repositories/post-repository");
const userRepository = require("../repositories/user-repository");
const Post = require("../models/post");
const PostNotFoundException = require("../utils/exception/post-not-found-excepiton");
const { detailPostDTO } = require("../models/dtos/detail-post-dto");

async function isExistsWithId(id) {
  const isExists = await postRepository.isExistsWithId(id);
  if (!isExists) throw new PostNotFoundException(id);
}

async function getById(id) {
  await isExistsWithId(id);
  return await postRepository.getById(id);
}

async function getDetails(id) {
  const post = await getById(id);
  const user = await userRepository.getById(post.userId);
  return detailPostDTO(post, user);
}

async function getListByUserId(userId) {
  return await postRepository.getListByUserId(userId);
}

async function getListByDistrictId(districtId) {
  return await postRepository.getListByDistrictId(districtId);
}

async function getListByProvinceId(provinceId) {
  return await postRepository.getListByProvinceId(provinceId);
}

async function getListByProvinceIdForFree(provinceId) {
  return await postRepository.getListByProvinceIdForFree(provinceId);
}

async function addPost(postToAdd, userId) {
  const newPost = new Post(postToAdd);
  newPost.userId = userId;
  await postRepository.addPost(newPost);
  return newPost._id;
}

async function updatePost(id, postToUpdate) {
  await isExistsWithId(id);
  await postRepository.updatePost(id, postToUpdate);
}

async function deletePost(id) {
  await isExistsWithId(id);
  await postRepository.deletePost(id);
}

//* starred-post

async function getStarredUsersByPostId(postId) {
  const post = await getById(postId);
  const starredUsers = [];

  for (const userId of post.starredUsers) {
    if (await userRepository.isActiveWithId(userId)) {
      const user = await userRepository.getById(userId);
      starredUsers.push(user);
    }
  }

  return starredUsers;
}

async function addStarredPost(post, userId) {
  post.starredUsers.push(userId);
  await postRepository.savePost(post);
}

async function deleteStarredPost(post, userId) {
  post.starredUsers.pull(userId);
  await postRepository.savePost(post);
}

module.exports = {
  getById,
  getDetails,
  getListByUserId,
  getListByDistrictId,
  getListByProvinceId,
  getListByProvinceIdForFree,
  addPost,
  updatePost,
  deletePost,
  getStarredUsersByPostId,
  addStarredPost,
  deleteStarredPost,
};
