const express = require('express');
const router = express.Router();
const { validateBody, validateParams } = require('../middleware/validation');
const {
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema
} = require('../validators/categoryValidators');
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

// GET /categories - Obtener todas las categorías
router.get('/', getCategories);

// POST /categories - Crear una nueva categoría
router.post('/',
  validateBody(createCategorySchema),
  createCategory
);

// GET /categories/:categoryId - Obtener una categoría específica
router.get('/:categoryId',
  validateParams(categoryIdSchema),
  getCategoryById
);

// PUT /categories/:categoryId - Actualizar una categoría
router.put('/:categoryId',
  validateParams(categoryIdSchema),
  validateBody(updateCategorySchema),
  updateCategory
);

// DELETE /categories/:categoryId - Eliminar una categoría
router.delete('/:categoryId',
  validateParams(categoryIdSchema),
  deleteCategory
);

module.exports = router;