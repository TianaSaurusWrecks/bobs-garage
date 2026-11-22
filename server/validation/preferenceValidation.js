const Joi = require("joi");

const preferenceSchema = Joi.object({
    dark_mode: Joi.boolean().required()
});

module.exports = { preferenceSchema };