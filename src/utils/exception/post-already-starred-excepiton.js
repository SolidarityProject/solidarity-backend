class PostAlreadyStarredException extends Error {
  constructor(id) {
    super("Post with id of " + id + " already starred");
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.status = 400;
  }

  statusCode() {
    return this.status;
  }
}

module.exports = PostAlreadyStarredException;
