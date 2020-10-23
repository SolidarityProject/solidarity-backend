const postService = require("../services/post-service");
const validation = require("../utils/validation/post-validation");

exports.getById = async (req, res) => {
  try {
    const post = await postService.getById(req.params.postId);
    res.status(200).send(post);
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
};

exports.getDetailById = async (req, res) => {
  try {
    const postDetail = await postService.getDetails(req.params.postId);
    res.status(200).send(postDetail);
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
};

exports.getListByUserId = async (req, res) => {
  try {
    const posts = await postService.getListByUserId(req.params.userId);
    res.status(200).send(posts);
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
};

exports.getListByDistrictId = async (req, res) => {
  try {
    const posts = await postService.getListByDistrictId(req.params.districtId);
    res.status(200).send(posts);
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
};

exports.getListByProviceId = async (req, res) => {
  try {
    const posts = await postService.getListByProvinceId(req.params.provinceId);
    res.status(200).send(posts);
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
};

exports.getListByProvinceIdForFree = async (req, res) => {
  try {
    const posts = await postService.getListByProvinceIdForFree(req.params.provinceId);
    res.status(200).send(posts);
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
};

exports.add = async (req, res) => {
  //* add validations (title, description, picture, address, dateSolidarity)
  const { error } = validation.addPostValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const postId = await postService.addPost(req.body, req.user._id);
    res.location("/api/v1/posts/" + postId);
    res.status(201).send();
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
};

exports.update = async (req, res) => {
  //* update validations (_id, title, description, picture ... all property)
  const { error } = validation.updatePostValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    await postService.updatePost(req.body._id, req.body._id);
    res.status(204).send();
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
};

exports.delete = async (req, res) => {
  //* delete validations (_id, userId)
  const { error } = validation.deletePostValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    await postService.deletePost(req.body._id);
    res.status(204).send();
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
};

//* starred-post

exports.getStarredUsersByPostId = async (req, res) => {
  try {
    const starredUsers = await postService.getStarredUsersByPostId(req.params.postId);
    res.status(200).send(starredUsers);
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
};
