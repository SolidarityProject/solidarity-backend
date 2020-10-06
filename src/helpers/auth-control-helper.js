//* checking account -> is active account ?
function auth_error_control(verifiedData) {
  if (!verifiedData.activeStatus) 
    return true; //!  activeStatus == false -> there is an error (return true)

  return false;
}

//* checking account -> is active & own account ?
function auth_user_error_control(verifiedData, reqBodyData) {
  if (auth_error_control(verifiedData) || verifiedData._id != reqBodyData._id)
    return true; //!  activeStatus == false or verifiedData._id != reqBodyData._id -> there is an error (return true)

  return false;
}

//* checking account -> is active account & own post ?
function auth_post_error_control(verifiedData, reqBodyData) {
  if (auth_error_control(verifiedData) || verifiedData._id != reqBodyData.userId)
    return true;

  return false;
}

//* checking account -> is active & verified account & own post
function auth_post_verified_error_control(verifiedData, reqBodyData) {
  if (auth_post_error_control(verifiedData, reqBodyData) || !verifiedData.verifiedStatus)
    return true;

  return false;
}

module.exports = {
  auth_err_control: auth_error_control,
  auth_user_err_control: auth_user_error_control,
  auth_post_err_control: auth_post_error_control,
  auth_post_verified_err_control: auth_post_verified_error_control,
};
