const usernameRegexPattern = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;

const emailRegexPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

module.exports = {
  usernameRegexPattern,
  emailRegexPattern,
};
