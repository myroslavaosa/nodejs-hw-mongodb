// src/validation/requestResetEmailSchema.js
import Joi from 'joi';

export const requestResetEmailSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Email must be a valid email address',
        'any.required': 'Email is required',
    }),
});
