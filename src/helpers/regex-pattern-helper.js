const usernameRegexPattern = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;

const emailRegexPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/;

module.exports = {
  usernameRegexPattern,
  emailRegexPattern,
};
