const Joi = require('joi');

const createCategorySchema = Joi.object({
  name: Joi.string()
    .trim()
    .max(100)
    .required()
    .messages({
      'string.empty': 'El nombre es requerido',
      'string.max': 'El nombre no puede exceder 100 caracteres',
      'any.required': 'El nombre es requerido'
    }),
  
  description: Joi.string()
    .trim()
    .max(500)
    .optional()
    .allow('')
    .messages({
      'string.max': 'La descripción no puede exceder 500 caracteres'
    }),
  
  color: Joi.string()
    .pattern(/^#[0-9A-Fa-f]{6}$/)
    .optional()
    .messages({
      'string.pattern.base': 'El color debe ser un código hexadecimal válido (ej: #3498db)'
    })
});

const updateCategorySchema = Joi.object({
  name: Joi.string()
    .trim()
    .max(100)
    .required()
    .messages({
      'string.empty': 'El nombre es requerido',
      'string.max': 'El nombre no puede exceder 100 caracteres',
      'any.required': 'El nombre es requerido'
    }),
  
  description: Joi.string()
    .trim()
    .max(500)
    .optional()
    .allow('')
    .messages({
      'string.max': 'La descripción no puede exceder 500 caracteres'
    }),
  
  color: Joi.string()
    .pattern(/^#[0-9A-Fa-f]{6}$/)
    .optional()
    .messages({
      'string.pattern.base': 'El color debe ser un código hexadecimal válido (ej: #3498db)'
    })
});

const categoryIdSchema = Joi.object({
  categoryId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'El ID de categoría debe ser un número',
      'number.integer': 'El ID de categoría debe ser un entero',
      'number.positive': 'El ID de categoría debe ser positivo',
      'any.required': 'El ID de categoría es requerido'
    })
});

module.exports = {
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema
};