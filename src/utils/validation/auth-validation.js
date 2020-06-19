const Joi = require("@hapi/joi");

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
            .min(birthdateCheck(100))
            .max(birthdateCheck(18))
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

function birthdateCheck(year) {
    return new Date(new Date().setFullYear(new Date().getFullYear() - year));
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;