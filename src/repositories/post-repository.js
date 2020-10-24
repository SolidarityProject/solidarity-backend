const Post = require("../models/post");
const { getDateForCheck_minute } = require("../helpers/date-helper");

async function isExistsWithId(id) {
  return await Post.exists({ _id: id });
}

async function isExistsWithIdForStarred(id, dateSolidarity) {
  return await Post.exists({ _id: id, activeStatus: true, dateSolidarity: { $gt: dateSolidarity } });
}

async function getById(id) {
  return Post.findById(id);
}

async function getListByUserId(userId) {
  return await Post.find({ userId: userId, activeStatus: true });
}

async function getListByDistrictId(districtId) {
  return await Post.find({
    "address.districtId": districtId,
    activeStatus: true,
    dateSolidarity: { $gt: getDateForCheck_minute(15) }, // TODO : date func move to service
  }).sort("dateSolidarity");
}

async function getListByProvinceId(provinceId) {
  return await Post.find({
    "address.provinceId": provinceId,
    activeStatus: true,
    dateSolidarity: { $gt: getDateForCheck_minute(15) },
  }).sort("dateSolidarity");
}

async function getListByProvinceIdForFree(provinceId) {
  return await Post.find({
    "address.provinceId": provinceId,
    activeStatus: true,
    dateSolidarity: { $gt: getDateForCheck_minute(15) },
  })
    .sort("dateSolidarity")
    .limit(3);
}

async function createPost(postToCrate) {
  const newPost = new Post(postToCrate);
  await savePost(newPost);
  return newPost._id;
}

async function savePost(postToSave) {
  await postToSave.save();
}

async function updatePost(id, postToUpdate) {
  await Post.findByIdAndUpdate(id, postToUpdate);
}

async function deletePost(id) {
  await Post.findByIdAndUpdate(id, { $set: { activeStatus: false } });
}

module.exports = {
  isExistsWithId,
  isExistsWithIdForStarred,
  getById,
  getListByUserId,
  getListByDistrictId,
  getListByProvinceId,
  getListByProvinceIdForFree,
  createPost,
  savePost,
  updatePost,
  deletePost,
};
