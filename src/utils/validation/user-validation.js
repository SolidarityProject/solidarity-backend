const Joi = require("@hapi/joi");
const addressValidationObj = require("./address-validation");
const { getDateForCheck_year } = require("../../helpers/date-helper");
const {
  usernameRegexPattern,
  emailRegexPattern,
} = require("../../helpers/regex-pattern-helper");

function updateUserValidation(data) {
  const schema = Joi.object({
    _id: Joi.string().required(),

    name: Joi.string().min(2).max(50).required(),

    lastname: Joi.string().min(2).max(50).required(),

    username: Joi.string().min(2).max(20).regex(usernameRegexPattern),

    email: Joi.string().lowercase().email().regex(emailRegexPattern),

    pictureUrl: Joi.string(),

    gender: Joi.number().min(0).max(4),

    birthdate: Joi.date()
      .min(getDateForCheck_year(-100)) // valid age -> 18 - 100
      .max(getDateForCheck_year(-18)),

    address: addressValidationObj.required(),
  });

  return schema.validate(data);
}

function deleteUserValidation(data) {
  const schema = Joi.object({
    _id: Joi.string().required(),
  });

  return schema.validate(data);
}

function changePasswordValidation(data) {
  const schema = Joi.object({
    _id: Joi.string().required(),

    oldPassword: Joi.string().required(),

    newPassword: Joi.string().min(6).max(15).required(),
  });

  return schema.validate(data);
}

module.exports = {
  updateUserValidation,
  deleteUserValidation,
  changePasswordValidation,
};
