const express = require('express');
const router = express.Router();
const { validateBody, validateParams, validateQuery } = require('../middleware/validation');
const {
  createTaskSchema,
  updateTaskSchema,
  patchTaskSchema,
  queryParamsSchema,
  taskIdSchema
} = require('../validators/taskValidators');
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  patchTask,
  deleteTask
} = require('../controllers/taskController');

// GET /tasks - Obtener todas las tareas con filtros y paginación
router.get('/', 
  validateQuery(queryParamsSchema),
  getTasks
);

// POST /tasks - Crear una nueva tarea
router.post('/',
  validateBody(createTaskSchema),
  createTask
);

// GET /tasks/:taskId - Obtener una tarea específica
router.get('/:taskId',
  validateParams(taskIdSchema),
  getTaskById
);

// PUT /tasks/:taskId - Actualizar completamente una tarea
router.put('/:taskId',
  validateParams(taskIdSchema),
  validateBody(updateTaskSchema),
  updateTask
);

// PATCH /tasks/:taskId - Actualizar parcialmente una tarea
router.patch('/:taskId',
  validateParams(taskIdSchema),
  validateBody(patchTaskSchema),
  patchTask
);

// DELETE /tasks/:taskId - Eliminar una tarea
router.delete('/:taskId',
  validateParams(taskIdSchema),
  deleteTask
);

module.exports = router;