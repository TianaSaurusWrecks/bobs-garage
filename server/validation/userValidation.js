const Joi = require("joi");

// Validation rules for user registration
const registerSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required(),

    email: Joi.string()
        .trim()
        .email()
        .max(255)
        .required(),

    password: Joi.string()
        .min(8)
        .max(128)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/)
        .required()
        .messages({
            "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character."
    })
});

// Validation rules for user login
const loginSchema = Joi.object({
    email: Joi.string()
        .trim()
        .email()
        .required(),

    password: Joi.string()
        .required()
});

// validation rules for updating a user's profile
const updateProfileSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required(),

    email: Joi.string()
        .trim()
        .email()
        .max(255)
        .required()
});

// Validation rules for an admin updating a user
const updateUserByAdminSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required(),

    email: Joi.string()
        .trim()
        .email()
        .max(255)
        .required(),

    role: Joi.string()
        .valid("customer", "admin")
        .required()
});

module.exports = {
    registerSchema, // checks registration information
    loginSchema,     // checks login information
    updateProfileSchema, // checks update profile
    updateUserByAdminSchema
};