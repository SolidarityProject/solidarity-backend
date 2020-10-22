const postRepository = require("../repositories/post-repository");
const Post = require("../models/post"); 
const User = require("../models/user"); 
const { detailPostDTO } = require("../models/dtos/detail-post-dto");
const PostNotFoundException = require("../utils/exception/post-not-found-excepiton");

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
  const user = await User.findById(post.userId); // TODO : implement user repository
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
};
