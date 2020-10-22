class PostNotFoundException extends Error {
  constructor(id) {
    super("Post with id of " + id + " not found");
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.status = 404;
  }

  statusCode() {
    return this.status;
  }
}

module.exports = PostNotFoundException;
