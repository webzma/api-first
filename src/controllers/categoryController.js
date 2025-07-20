const Category = require('../models/Category');
const Task = require('../models/Task');
const { NotFoundError, BadRequestError, ConflictError } = require('../middleware/errorHandler');

const getCategories = async (req, res) => {
  const categories = await Category.getAll();
  res.status(200).json(categories.map(category => category.toJSON()));
};

const getCategoryById = async (req, res) => {
  const { categoryId } = req.params;
  
  const category = await Category.getById(categoryId);
  
  if (!category) {
    throw new NotFoundError('La categoría solicitada no fue encontrada');
  }

  res.status(200).json(category.toJSON());
};

const createCategory = async (req, res) => {
  const { name, description, color } = req.body;

  // Verificar que el nombre no esté en uso
  const existingCategory = await Category.getByName(name);
  if (existingCategory) {
    throw new ConflictError('Ya existe una categoría con ese nombre');
  }

  const category = new Category({
    name,
    description,
    color
  });

  const categoryId = await category.save();
  const createdCategory = await Category.getById(categoryId);

  res.status(201).json(createdCategory.toJSON());
};

const updateCategory = async (req, res) => {
  const { categoryId } = req.params;
  const { name, description, color } = req.body;

  // Verificar que la categoría existe
  const existingCategory = await Category.getById(categoryId);
  if (!existingCategory) {
    throw new NotFoundError('La categoría solicitada no fue encontrada');
  }

  // Verificar que el nombre no esté en uso por otra categoría
  const nameExists = await Category.nameExists(name, categoryId);
  if (nameExists) {
    throw new ConflictError('Ya existe otra categoría con ese nombre');
  }

  const updateData = {
    name,
    description,
    color
  };

  const updated = await Category.update(categoryId, updateData);
  
  if (!updated) {
    throw new BadRequestError('No se pudo actualizar la categoría');
  }

  const updatedCategory = await Category.getById(categoryId);
  res.status(200).json(updatedCategory.toJSON());
};

const deleteCategory = async (req, res) => {
  const { categoryId } = req.params;

  // Verificar que la categoría existe
  const categoryExists = await Category.exists(categoryId);
  if (!categoryExists) {
    throw new NotFoundError('La categoría solicitada no fue encontrada');
  }

  // Verificar que no tenga tareas asociadas
  const taskCount = await Task.getTasksByCategory(categoryId);
  if (taskCount > 0) {
    throw new ConflictError('No se puede eliminar la categoría porque tiene tareas asociadas');
  }

  const deleted = await Category.delete(categoryId);
  
  if (!deleted) {
    throw new BadRequestError('No se pudo eliminar la categoría');
  }

  res.status(204).send();
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};