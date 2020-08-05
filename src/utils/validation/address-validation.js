const Joi = require("@hapi/joi");

module.exports = Joi.object({
  country: Joi.string().required(),
  countryId: Joi.string().required(),
  province: Joi.string().required(),
  provinceId: Joi.string().required(),
  district: Joi.string().required(),
  districtId: Joi.string().required(),
});
