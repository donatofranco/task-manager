const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createCategory = async (req, res) => {
  console.log("Inicio creación de categoría.");
  const { name, color } = req.body;
  const userId = req.user.id;

  try {
    const category = await prisma.category.create({
      data: {
        name,
        color,
        userId,
      },
    });

    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la categoría' });
  }
  console.log("Fin creación de categoría.");
};

const getCategories = async (req, res) => {
  console.log("Inicio obtención de categorías.");
  const userId = req.user.id;

  try {
    const categories = await prisma.category.findMany({
      where: { userId },
    });

    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las categorías' });
  }
  console.log("Fin obtención de categorías.");
};

const getCategoryById = async (req, res) => {
  const { id } = req.params;
  console.log("Inicio obtención de categoría por id:", id);
  const userId = req.user.id;

  try {
    const category = await prisma.category.findFirst({
      where: { id: parseInt(id), userId },
      include: {
        tasks: true // Incluir las tareas asociadas a esta categoría
      }
    });

    if (!category) return res.status(404).json({ error: 'Categoría no encontrada' });

    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la categoría' });
  }
  console.log("Fin obtención de categoría por id:", id);
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  console.log("Inicio actualización de categoría por id:", id);
  const userId = req.user.id;
  const { name, color } = req.body;

  try {
    const existingCategory = await prisma.category.findFirst({
      where: { id: parseInt(id), userId },
    });

    if (!existingCategory) return res.status(404).json({ error: 'Categoría no encontrada' });

    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        name,
        color,
      },
    });

    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la categoría' });
  }
  console.log("Fin actualización de categoría por id:", id);
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  console.log("Inicio eliminación de categoría por id:", id);
  const userId = req.user.id;

  try {
    const existingCategory = await prisma.category.findFirst({
      where: { id: parseInt(id), userId },
    });

    if (!existingCategory) return res.status(404).json({ error: 'Categoría no encontrada' });

    // Actualizar las tareas asociadas para quitar la relación con la categoría
    await prisma.task.updateMany({
      where: { categoryId: parseInt(id) },
      data: { categoryId: null }
    });

    // Eliminar la categoría
    await prisma.category.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Categoría eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la categoría' });
  }
  console.log("Fin eliminación de categoría por id:", id);
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};