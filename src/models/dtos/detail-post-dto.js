function detailPostDTO(post, user) {
  return {
    post: post,
    createdFullName: user.name + " " + user.lastname,
    createdPictureUrl: user.pictureUrl,
  };
}
module.exports = { detailPostDTO };
