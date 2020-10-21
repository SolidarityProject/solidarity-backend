const Post = require("../models/post");
const User = require("../models/user");
const { getDateForCheck_minute } = require("../helpers/date-helper");
const { detailPostDTO } = require("../models/dtos/detail-post-dto");

async function getById(id) {
  return Post.findById(id);
}

async function getDetails(post) {
  const user = await User.findById(post.userId);
  return detailPostDTO(post, user);
}

async function getListByUserId(userId) {
  return await Post.find({ userId: userId, activeStatus: true });
}

async function getListByDistrictId(districtId) {
  return await Post.find({
    "address.districtId": districtId,
    activeStatus: true,
    dateSolidarity: { $gt: getDateForCheck_minute(15) }
  }).sort("dateSolidarity");
}

async function getListByProvinceId(provinceId) {
  return await Post.find({
    "address.provinceId": provinceId,
    activeStatus: true,
    dateSolidarity: { $gt: getDateForCheck_minute(15) }
  }).sort("dateSolidarity");
}

async function getListByProvinceIdForFree(provinceId) {
  return await Post.find({
    "address.provinceId": provinceId,
    activeStatus: true,
    dateSolidarity: { $gt: getDateForCheck_minute(15) }
  }).sort("dateSolidarity").limit(3);
}

async function addPost(postToAdd, userId) {
  const newPost = new Post(postToAdd);
  newPost.userId = userId;
  const post = await newPost.save();
  return post._id;
}

async function updatePost(id, postToUpdate) {
  await Post.findByIdAndUpdate(id, postToUpdate);
}

async function deletePost(id) {
  await Post.findByIdAndUpdate(id, { $set: { activeStatus: false } });
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
  deletePost
};
