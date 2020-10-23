const userService = require("../services/user-service");
const postService = require("../services/post-service");
const validation = require("../utils/validation/user-validation");

exports.getMyInfo = async (req, res) => {
  try {
    const user = await userService.getById(req.user._id);
    res.status(200).send(user);
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
};

exports.getById = async (req, res) => {
  try {
    const user = await userService.getById(req.params.userId);
    res.status(200).send(user);
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
};

exports.getByUsername = async (req, res) => {
  try {
    const user = await userService.getByUsername(req.params.username);
    res.status(200).send(user);
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
};

exports.updateUser = async (req, res) => {
  try {
    //* update validations (_id, name, lastname ... all property)
    const { error } = validation.updateUserValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    await userService.updateUser(req.body._id, req.body);
    res.status(204).send();
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
};

// TODO : PATCH - change password
exports.changePassword = async (req, res) => {
  try {
    //* change password validations (_id, oldPassword, newPassword )
    const { error } = validation.changePasswordValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    await userService.changePassword(req.body);
    res.status(204).send();
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    //* delete validations (_id)
    const { error } = validation.deleteUserValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    await userService.deleteUser(req.body._id);
    res.status(204).send();
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
};

//* starred-post

exports.getMyStarredPosts = async (req, res) => {
  try {
    const starredPosts = await userService.getMyStarredPosts(req.user._id);
    res.status(200).send(starredPosts);
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
};

exports.getStarredPostsByUserId = async (req, res) => {
  try {
    const starredPosts = await userService.getStarredPostsByUserId(req.params.userId);
    res.status(200).send(starredPosts);
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
};

exports.addStarredPost = async (req, res) => {
  //* add starred post validations (postId)
  const { error } = validation.addStarredPostValidation(req.body);
  if (error) 
    return res.status(400).send(error.details[0].message);

  try {
    const user = await userService.getById(req.user._id);
    await userService.checkStarredStatusForAdd(user.starredPosts, req.body.postId);
    const post = await postService.getById(req.body.postId);
    await postService.addStarredPost(post, req.user._id);
    await userService.addStarredPost(user, req.body.postId);
    res.location("/api/v1/users/" + user._id + "/starred");
    res.status(201).send();
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
};

exports.deleteStarredPost = async (req, res) => {
  try {
    const user = await userService.getById(req.user._id);
    await userService.checkStarredStatusForDelete(user.starredPosts, req.params.postId);
    const post = await postService.getById(req.params.postId);
    await postService.deleteStarredPost(post, req.user._id);
    await userService.deleteStarredPost(user, req.params.postId);
    res.status(204).send();
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
};
