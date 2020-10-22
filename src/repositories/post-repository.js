const Post = require("../models/post");
const { getDateForCheck_minute } = require("../helpers/date-helper");

async function isExistsWithId(id) {
  return await Post.exists({ _id: id });
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
    dateSolidarity: { $gt: getDateForCheck_minute(15) },
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

async function addPost(postToAdd) {
  await postToAdd.save();
}

async function updatePost(id, postToUpdate) {
  await Post.findByIdAndUpdate(id, postToUpdate);
}

async function deletePost(id) {
  await Post.findByIdAndUpdate(id, { $set: { activeStatus: false } });
}

module.exports = {
  isExistsWithId,
  getById,
  getListByUserId,
  getListByDistrictId,
  getListByProvinceId,
  getListByProvinceIdForFree,
  addPost,
  updatePost,
  deletePost,
};
