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

module.exports = { addPostValidation };