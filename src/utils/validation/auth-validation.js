const Joi = require("@hapi/joi");
const addressValidationObj = require("./address-validation");
const { getDateForCheck_year } = require("../helper/date-helper");

const registerValidation = data => {
    const schema = Joi.object({

        name: Joi.string()
            .min(2)
            .max(50)
            .required(),

        lastname: Joi.string()
            .min(2)
            .max(50)
            .required(),

        email: Joi.string()
            .lowercase()
            .email()
            .required(),

        password: Joi.string()
            .min(6)
            .max(15)
            .required(),

        pictureUrl: Joi.string(),

        gender: Joi.number()
            .min(0)
            .max(4),

        birthdate: Joi.date()
            .min(getDateForCheck_year(-100)) // valid age -> 18 - 100
            .max(getDateForCheck_year(-18)),

        address: addressValidationObj.required()
    });

    return schema.validate(data);
};

const loginValidation = data => {
    const schema = Joi.object({

        email: Joi.string()
            .lowercase()
            .email()
            .required(),

        password: Joi.string()
            .min(6)
            .max(15)
            .required(),
    });

    return schema.validate(data);
};


module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;