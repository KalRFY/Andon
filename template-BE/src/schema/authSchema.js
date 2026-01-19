const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(5).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 5 characters long',
    'any.required': 'Name is required',
  }),

  phone: Joi.string().min(10).required().messages({
    'string.empty': 'Phone number is required',
    'string.min': 'Phone number must be at least 10 characters long',
    'any.required': 'Phone number is required',
  }),

  noreg: Joi.string().min(5).required().messages({
    'string.empty': 'Noreg is required',
    'string.min': 'Noreg must be at least 5 characters long',
    'any.required': 'Noreg is required',
  }),
});

const loginSchema = Joi.object({
  noreg: Joi.string().min(5).required().messages({
    'string.empty': 'Noreg is required',
    'string.min': 'Noreg must be at least 5 characters long',
    'any.required': 'Noreg is required',
  }),

  password: Joi.string().min(4).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 4 characters long',
    'any.required': 'Password is required',
  }),
});

module.exports = {
    registerSchema,
    loginSchema
}