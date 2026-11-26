// server/validation/imageValidation.js

const Joi = require("joi");

const imageSchema = Joi.object({
    filename: Joi.string().trim().min(1).max(255).required(),

    // URI - Uniform Resource Identifier - checks it is valid web address
    image_url: Joi.string().trim().uri().required(),

    alt_text: Joi.string().trim().min(1).max(255).required(),

    service_id: Joi.number().integer().positive().allow(null).optional(),

    staff_id: Joi.number().integer().positive().allow(null).optional(),

    user_id: Joi.number().integer().positive().allow(null).optional(),

    image_type: Joi.string()
        .valid("home", "about", "gallery")
        .allow(null)
        .optional()
});

module.exports = { imageSchema };