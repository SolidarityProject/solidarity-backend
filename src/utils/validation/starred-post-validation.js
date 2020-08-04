const Joi = require("@hapi/joi");

function addStarredPostValidation(data) {
  const schema = Joi.object({
    postId: Joi.string().required(),
  });

  return schema.validate(data);
}

function deleteStarredPostValidation(data) {
  const schema = Joi.object({
    postId: Joi.string().required(),
  });

  return schema.validate(data);
}
module.exports = {
  addStarredPostValidation,
  deleteStarredPostValidation,
};
