const Joi = require("@hapi/joi");

function userUpdateValidation(data) {
    const schema = Joi.object({

        _id: Joi.string()
            .required(),

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

        pictureUrl: Joi.string(), // TODO : regex -> .png, .jpg, etc

        gender: Joi.number()
            .min(0)
            .max(4),

        birthdate: Joi.date()
            .min(getDateForCheck_year(-100)) // valid age -> 18 - 100
            .max(getDateForCheck_year(-18)),

        activeStatus: Joi.boolean(),

        verifiedStatus: Joi.boolean(),

        dateCreated: Joi.date(),
    });

    return schema.validate(data);
};

function userDeleteValidation(data) {
    const schema = Joi.object({

        _id: Joi.string()
            .required(),
    });

    return schema.validate(data);
};

module.exports = { userUpdateValidation, userDeleteValidation };