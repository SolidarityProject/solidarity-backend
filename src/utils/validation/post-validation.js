const Joi = require("@hapi/joi");
const addressValidationObj = require("./address-validation");
const { getDateForCheck_hour, getDateForCheck_month } = require("../../helpers/date-helper");

function addPostValidation(data) {
    const schema = Joi.object({

        title: Joi.string()
            .min(5)
            .max(50)
            .required(),

        description: Joi.string()
            .min(10)
            .max(250)
            .required(),

        pictureUrl: Joi.string(),

        address: addressValidationObj.required(),

        dateSolidarity: Joi.date()
            .min(getDateForCheck_hour(2)) // min 2 hour later
            .max(getDateForCheck_month(2)) // max 2 month later
            .required()
    });

    return schema.validate(data);
};

function updatePostValidation(data) {
    const schema = Joi.object({

        _id: Joi.string()
            .required(),

        title: Joi.string()
            .min(5)
            .max(50)
            .required(),

        description: Joi.string()
            .min(10)
            .max(250)
            .required(),

        pictureUrl: Joi.string(),

        address: addressValidationObj.required(),

        dateSolidarity: Joi.date()
            .min(getDateForCheck_hour(2)) // min 2 hour later
            .max(getDateForCheck_month(2)) // max 2 month later
            .required(),

        userId: Joi.string()
            .required()
    });

    return schema.validate(data);
};

function deletePostValidation(data) {
    const schema = Joi.object({

        _id: Joi.string()
            .required(),

        userId: Joi.string()
            .required()
    });

    return schema.validate(data);
};

module.exports = { addPostValidation, updatePostValidation, deletePostValidation };