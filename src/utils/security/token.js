const jwt = require("jsonwebtoken");

//* create token (1h)
function createToken(user) {
  return jwt.sign(
    {
      _id: user._id,
      activeStatus: user.activeStatus,
      verifiedStatus: user.verifiedStatus,
    },
    process.env.SECRET_KEY,
    { expiresIn: process.env.EXPIRE_TIME }
  ); // default encryption algoritm : HS256
}

//* create token for change password (2m)
function createToken_changePassword(userId) {
  return jwt.sign(
    {
      _id: userId,
      activeStatus: false,
      verifiedStatus: false,
    },
    process.env.SECRET_KEY,
    { algorithm: "HS512", expiresIn: 120 }
  );
}

module.exports = { createToken, createToken_changePassword };
