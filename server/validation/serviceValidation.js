const Joi = require("joi");

const serviceSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    description: Joi.string().trim().min(5).required(),
    price: Joi.number().min(0).precision(2).required(),
    image_url: Joi.alternatives().try(
        Joi.string().uri(),
        Joi.string().pattern(/^\/images\/.+/)
    ).required()
});

module.exports = { serviceSchema };