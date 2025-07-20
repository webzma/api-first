const Joi = require('joi');

const taskStatus = ['pending', 'in_progress', 'completed', 'cancelled'];
const taskPriority = ['low', 'medium', 'high', 'urgent'];

const createTaskSchema = Joi.object({
  title: Joi.string()
    .trim()
    .max(200)
    .required()
    .messages({
      'string.empty': 'El título es requerido',
      'string.max': 'El título no puede exceder 200 caracteres',
      'any.required': 'El título es requerido'
    }),
  
  description: Joi.string()
    .trim()
    .max(1000)
    .required()
    .messages({
      'string.empty': 'La descripción es requerida',
      'string.max': 'La descripción no puede exceder 1000 caracteres',
      'any.required': 'La descripción es requerida'
    }),
  
  priority: Joi.string()
    .valid(...taskPriority)
    .required()
    .messages({
      'any.only': 'La prioridad debe ser uno de: low, medium, high, urgent',
      'any.required': 'La prioridad es requerida'
    }),
  
  due_date: Joi.date()
    .iso()
    .min('now')
    .optional()
    .messages({
      'date.min': 'La fecha límite debe ser en el futuro',
      'date.format': 'La fecha límite debe estar en formato ISO'
    }),
  
  category_id: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      'number.base': 'El ID de categoría debe ser un número',
      'number.integer': 'El ID de categoría debe ser un entero',
      'number.positive': 'El ID de categoría debe ser positivo'
    })
});

const updateTaskSchema = Joi.object({
  title: Joi.string()
    .trim()
    .max(200)
    .required()
    .messages({
      'string.empty': 'El título es requerido',
      'string.max': 'El título no puede exceder 200 caracteres',
      'any.required': 'El título es requerido'
    }),
  
  description: Joi.string()
    .trim()
    .max(1000)
    .required()
    .messages({
      'string.empty': 'La descripción es requerida',
      'string.max': 'La descripción no puede exceder 1000 caracteres',
      'any.required': 'La descripción es requerida'
    }),
  
  status: Joi.string()
    .valid(...taskStatus)
    .required()
    .messages({
      'any.only': 'El estado debe ser uno de: pending, in_progress, completed, cancelled',
      'any.required': 'El estado es requerido'
    }),
  
  priority: Joi.string()
    .valid(...taskPriority)
    .required()
    .messages({
      'any.only': 'La prioridad debe ser uno de: low, medium, high, urgent',
      'any.required': 'La prioridad es requerida'
    }),
  
  due_date: Joi.date()
    .iso()
    .optional()
    .allow(null)
    .messages({
      'date.format': 'La fecha límite debe estar en formato ISO'
    }),
  
  category_id: Joi.number()
    .integer()
    .positive()
    .optional()
    .allow(null)
    .messages({
      'number.base': 'El ID de categoría debe ser un número',
      'number.integer': 'El ID de categoría debe ser un entero',
      'number.positive': 'El ID de categoría debe ser positivo'
    })
});

const patchTaskSchema = Joi.object({
  title: Joi.string()
    .trim()
    .max(200)
    .optional()
    .messages({
      'string.empty': 'El título no puede estar vacío',
      'string.max': 'El título no puede exceder 200 caracteres'
    }),
  
  description: Joi.string()
    .trim()
    .max(1000)
    .optional()
    .messages({
      'string.empty': 'La descripción no puede estar vacía',
      'string.max': 'La descripción no puede exceder 1000 caracteres'
    }),
  
  status: Joi.string()
    .valid(...taskStatus)
    .optional()
    .messages({
      'any.only': 'El estado debe ser uno de: pending, in_progress, completed, cancelled'
    }),
  
  priority: Joi.string()
    .valid(...taskPriority)
    .optional()
    .messages({
      'any.only': 'La prioridad debe ser uno de: low, medium, high, urgent'
    }),
  
  due_date: Joi.date()
    .iso()
    .optional()
    .allow(null)
    .messages({
      'date.format': 'La fecha límite debe estar en formato ISO'
    }),
  
  category_id: Joi.number()
    .integer()
    .positive()
    .optional()
    .allow(null)
    .messages({
      'number.base': 'El ID de categoría debe ser un número',
      'number.integer': 'El ID de categoría debe ser un entero',
      'number.positive': 'El ID de categoría debe ser positivo'
    })
}).min(1).messages({
  'object.min': 'Debe proporcionar al menos un campo para actualizar'
});

const queryParamsSchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.base': 'La página debe ser un número',
      'number.integer': 'La página debe ser un entero',
      'number.min': 'La página debe ser mayor a 0'
    }),
  
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .messages({
      'number.base': 'El límite debe ser un número',
      'number.integer': 'El límite debe ser un entero',
      'number.min': 'El límite debe ser mayor a 0',
      'number.max': 'El límite no puede exceder 100'
    }),
  
  status: Joi.string()
    .valid(...taskStatus)
    .optional()
    .messages({
      'any.only': 'El estado debe ser uno de: pending, in_progress, completed, cancelled'
    }),
  
  category_id: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      'number.base': 'El ID de categoría debe ser un número',
      'number.integer': 'El ID de categoría debe ser un entero',
      'number.positive': 'El ID de categoría debe ser positivo'
    })
});

const taskIdSchema = Joi.object({
  taskId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'El ID de tarea debe ser un número',
      'number.integer': 'El ID de tarea debe ser un entero',
      'number.positive': 'El ID de tarea debe ser positivo',
      'any.required': 'El ID de tarea es requerido'
    })
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  patchTaskSchema,
  queryParamsSchema,
  taskIdSchema
};