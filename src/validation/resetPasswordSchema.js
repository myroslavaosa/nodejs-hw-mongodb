// src/validation/resetPasswordSchema.js
import Joi from 'joi';

export const resetPasswordSchema = Joi.object({
    token: Joi.string().required().messages({
        'any.required': 'Token is required',
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters long',
        'any.required': 'Password is required',
    }),
});
