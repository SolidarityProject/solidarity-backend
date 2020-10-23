class WrongPasswordCodeException extends Error {
  constructor() {
    super("Check your password code");
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.status = 400;
  }

  statusCode() {
    return this.status;
  }
}

module.exports = WrongPasswordCodeException;
