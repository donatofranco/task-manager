const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createTask = async (req, res) => {
  console.log("Inicio creacion de tarea.");
  const { title, description } = req.body;
  const userId = req.user.id; // Lo vamos a setear en el middleware de auth

  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        userId,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la tarea' });
  }
  console.log("Fin creacion de tarea.");
};

const getTasks = async (req, res) => {
  console.log("Inicio obtencion de tareas.");
  const userId = req.user.id;

  try {
    const tasks = await prisma.task.findMany({
      where: { userId },
    });

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las tareas' });
  }
  console.log("Fin obtencion de tareas.");
};

const getTaskById = async (req, res) => {
  const { id } = req.params;
  console.log("Inicio obtencion de tarea por id: ", id);
  const userId = req.user.id;

  try {
    const task = await prisma.task.findFirst({
      where: { id: parseInt(id), userId },
    });

    if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la tarea' });
  }
  console.log("Fin obtencion de tarea por id: ", id);
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  console.log("Inicio actualizacion de tarea por id: ", id);
  const userId = req.user.id;
  const { title, description, completed } = req.body;

  try {
    const existingTask = await prisma.task.findFirst({
      where: { id: parseInt(id), userId },
    });

    if (!existingTask) return res.status(404).json({ error: 'Tarea no encontrada' });

    const task = await prisma.task.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        completed,
      },
    });

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la tarea' });
  }
  console.log("Fin actualizacion de tarea por id: ", id);
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  console.log("Inicio eliminacion de tarea por id: ", id);
  const userId = req.user.id;

  try {
    const existingTask = await prisma.task.findFirst({
      where: { id: parseInt(id), userId },
    });

    if (!existingTask) return res.status(404).json({ error: 'Tarea no encontrada' });

    await prisma.task.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Tarea eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la tarea' });
  }
  console.log("Fin eliminacion de tarea por id: ", id);
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
