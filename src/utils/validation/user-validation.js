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
            .min(birthdateCheck(100))
            .max(birthdateCheck(18)),

        activeStatus: Joi.boolean(),

        verifiedStatus: Joi.boolean(),

        dateCreated: Joi.date(),
    });

    return schema.validate(data);
};

function birthdateCheck(year) { // TODO : move -> helper folder
    return new Date(new Date().setFullYear(new Date().getFullYear() - year));
}

module.exports = { userUpdateValidation };