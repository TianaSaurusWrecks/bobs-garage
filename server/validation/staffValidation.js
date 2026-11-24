const Joi = require("joi");

const staffSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),

    job_title: Joi.string().trim().min(2).max(100).required(),

    bio: Joi.string().trim().allow("").optional(),

    image_url: Joi.alternatives().try(
            Joi.string().uri(),
            Joi.string().pattern(/^\/images\/.+/)
        ).allow(null, "").optional()
});

module.exports = { staffSchema };