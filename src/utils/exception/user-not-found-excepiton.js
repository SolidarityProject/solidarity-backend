class UserNotFoundException extends Error {
  constructor(key, value) {
    // key -> id / username / email
    super("User with " + key + " of " + value + " not found");
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.status = 404;
  }

  statusCode() {
    return this.status;
  }
}

module.exports = UserNotFoundException;
