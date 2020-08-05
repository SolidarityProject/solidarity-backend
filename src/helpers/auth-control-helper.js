//* checking account -> is active account ?
function auth_error(verifiedData) {
  if (!verifiedData.activeStatus) return true; //!   activeStatus == false -> there is an error (return true)
}

//* checking account -> is active & own account ?
function auth_user_error(verifiedData, reqBodyData) {
  if (auth_error(verifiedData) || verifiedData._id != reqBodyData._id)
    return true; //!   activeStatus == false or verifiedData._id != reqBodyData._id -> there is an error (return true)
}

//* checking account -> is active account & own post ?
function auth_post_error(verifiedData, reqBodyData) {
  if (auth_error(verifiedData) || verifiedData._id != reqBodyData.userId)
    return true;
}

//* checking account -> is active & verified account & own post
function auth_post_verified_error(verifiedData, reqBodyData) {
  if (
    auth_post_error(verifiedData, reqBodyData) ||
    !verifiedData.verifiedStatus
  )
    return true;
}

module.exports = {
  auth_error,
  auth_user_error,
  auth_post_error,
  auth_post_verified_error,
};
