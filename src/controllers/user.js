const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();  // Importa el cliente de Prisma
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const saltRounds = 10;  // Para encriptar contraseñas

// Registrar usuario
const registerUser = async (req, res) => {
  console.log("Inicio registro de usuario.");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;

  // Verificar si el email ya está registrado
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return res.status(400).json({ message: 'Usuario ya registrado' });
  }

  // Encriptar la contraseña
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Crear el nuevo usuario en la base de datos
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });
  
  res.status(201).json({ message: 'Usuario registrado', user });
  console.log("Fin registro de usuario.");
};

// Login de usuario
const loginUser = async (req, res) => {
  console.log("Inicio login de usuario.");
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  // Buscar el usuario en la base de datos
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(400).json({ message: 'Usuario no encontrado' });
  }

  // Verificar la contraseña
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(400).json({ message: 'Contraseña incorrecta' });
  }

  // Generar un JWT
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });

  res.status(200).json({ message: 'Login exitoso', token });
  console.log("Fin login de usuario.");
};

module.exports = { registerUser, loginUser };
