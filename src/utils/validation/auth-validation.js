const Joi = require("@hapi/joi");
const addressValidationObj = require("./address-validation");
const { getDateForCheck_year } = require("../../helpers/date-helper");
const {
  usernameRegexPattern,
  emailRegexPattern,
} = require("../../helpers/regex-pattern-helper");

const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),

    lastname: Joi.string().min(2).max(50).required(),

    username: Joi.string()
      .min(2)
      .max(20)
      .regex(usernameRegexPattern)
      .required(),

    email: Joi.string().lowercase().email().regex(emailRegexPattern).required(),

    password: Joi.string().min(6).max(15).required(),

    pictureUrl: Joi.string(),

    gender: Joi.number().min(0).max(4),

    birthdate: Joi.date()
      .min(getDateForCheck_year(-100)) // valid age -> 18 - 100
      .max(getDateForCheck_year(-18)),

    address: addressValidationObj.required(),
  });

  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().lowercase().email().required(),

    password: Joi.string().required(),
  });

  return schema.validate(data);
};

const passwordRequestValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().lowercase().email().required(),
  });

  return schema.validate(data);
};

const changePasswordValidation = (data) => {
  const schema = Joi.object({
    _id: Joi.string().required(),

    newPassword: Joi.string().min(6).max(15).required(),

    passwordRequestCode: Joi.number().min(100000).max(999999),
  });

  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.passwordRequestValidation = passwordRequestValidation;
module.exports.changePasswordValidation = changePasswordValidation;
