const Task = require('../models/Task');
const Category = require('../models/Category');
const { NotFoundError, BadRequestError } = require('../middleware/errorHandler');

const getTasks = async (req, res) => {
  const { page, limit, status, category_id } = req.query;
  
  const filters = {};
  if (status) filters.status = status;
  if (category_id) filters.category_id = category_id;

  const pagination = { page, limit };

  const result = await Task.getAll(filters, pagination);
  res.status(200).json(result);
};

const getTaskById = async (req, res) => {
  const { taskId } = req.params;
  
  const task = await Task.getById(taskId);
  
  if (!task) {
    throw new NotFoundError('La tarea solicitada no fue encontrada');
  }

  res.status(200).json(task.toJSON());
};

const createTask = async (req, res) => {
  const { title, description, priority, due_date, category_id } = req.body;

  // Verificar que la categoría existe si se proporciona
  if (category_id) {
    const categoryExists = await Category.exists(category_id);
    if (!categoryExists) {
      throw new BadRequestError('La categoría especificada no existe');
    }
  }

  const task = new Task({
    title,
    description,
    priority,
    due_date,
    category_id
  });

  const taskId = await task.save();
  const createdTask = await Task.getById(taskId);

  res.status(201).json(createdTask.toJSON());
};

const updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { title, description, status, priority, due_date, category_id } = req.body;

  // Verificar que la tarea existe
  const existingTask = await Task.getById(taskId);
  if (!existingTask) {
    throw new NotFoundError('La tarea solicitada no fue encontrada');
  }

  // Verificar que la categoría existe si se proporciona
  if (category_id) {
    const categoryExists = await Category.exists(category_id);
    if (!categoryExists) {
      throw new BadRequestError('La categoría especificada no existe');
    }
  }

  const updateData = {
    title,
    description,
    status,
    priority,
    due_date,
    category_id
  };

  const updated = await Task.update(taskId, updateData);
  
  if (!updated) {
    throw new BadRequestError('No se pudo actualizar la tarea');
  }

  const updatedTask = await Task.getById(taskId);
  res.status(200).json(updatedTask.toJSON());
};

const patchTask = async (req, res) => {
  const { taskId } = req.params;
  const updateData = req.body;

  // Verificar que la tarea existe
  const existingTask = await Task.getById(taskId);
  if (!existingTask) {
    throw new NotFoundError('La tarea solicitada no fue encontrada');
  }

  // Verificar que la categoría existe si se proporciona
  if (updateData.category_id) {
    const categoryExists = await Category.exists(updateData.category_id);
    if (!categoryExists) {
      throw new BadRequestError('La categoría especificada no existe');
    }
  }

  const updated = await Task.update(taskId, updateData);
  
  if (!updated) {
    throw new BadRequestError('No se pudo actualizar la tarea');
  }

  const updatedTask = await Task.getById(taskId);
  res.status(200).json(updatedTask.toJSON());
};

const deleteTask = async (req, res) => {
  const { taskId } = req.params;

  // Verificar que la tarea existe
  const taskExists = await Task.exists(taskId);
  if (!taskExists) {
    throw new NotFoundError('La tarea solicitada no fue encontrada');
  }

  const deleted = await Task.delete(taskId);
  
  if (!deleted) {
    throw new BadRequestError('No se pudo eliminar la tarea');
  }

  res.status(204).send();
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  patchTask,
  deleteTask
};