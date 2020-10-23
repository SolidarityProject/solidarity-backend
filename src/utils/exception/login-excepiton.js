class LoginException extends Error {
  constructor() {
    super("Check your email or password");
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.status = 400;
  }

  statusCode() {
    return this.status;
  }
}

module.exports = LoginException;
