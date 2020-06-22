const Joi = require("@hapi/joi");
const { getDateForCheck_hour, getDateForCheck_month } = require("../helper/date-helper");

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

        address: {
            country: Joi.string()
                .required(),
            province: Joi.string()
                .required(),
            district: Joi.string()
                .required(),
        },
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

        address: {
            country: Joi.string()
                .required(),
            province: Joi.string()
                .required(),
            district: Joi.string()
                .required(),
        },

        activeStatus: Joi.boolean(),

        dateSolidarity: Joi.date()
            .min(getDateForCheck_hour(2)) // min 2 hour later
            .max(getDateForCheck_month(2)) // max 2 month later
            .required(),

        dateCreated: Joi.date(),

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