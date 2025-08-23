import Joi from 'joi';

export const registerUserSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required().messages({
        'string.email': 'Email must be a valid email address',
        'any.required': 'Email is required'
    }),
    password: Joi.string().required(),
});
