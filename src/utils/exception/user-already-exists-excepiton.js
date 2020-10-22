class UserAlreadyExistsException extends Error {
  constructor(key, value) {
    // key -> username / email
    super("User with " + key + " of " + value + " already exists");
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.status = 400;
  }

  statusCode() {
    return this.status;
  }
}

module.exports = UserAlreadyExistsException;
