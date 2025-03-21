const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user');
const taskRoutes = require('./routes/task');
const errorHandler = require('./middlewares/errorHandler');

// Cargar variables de entorno desde .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3030;

// Middlewares
app.use(express.json()); // Parsear JSON en los body requests
app.use('/api/users', userRoutes);  // Rutas de usuarios
app.use('/api/tasks', taskRoutes);
app.use(errorHandler); // Manejo global de errores

// Rutas base
app.get('/', (req, res) => {
  res.send('Bienvenido a la API de Task Manager');
});

// Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
