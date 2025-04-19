const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user');
const taskRoutes = require('./routes/task');
const errorHandler = require('./middlewares/errorHandler');
const helmet = require('helmet');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./openapi.yaml');

// Cargar variables de entorno desde .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
const corsOptions = {
  origin: process.env.CORS_ORIGINS.split(','), // frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  // credentials: true, // si necesitás enviar cookies o headers de autenticación
  optionsSuccessStatus: 200, // Para asegurar que responda OK al preflight
};


// Middlewares
app.use(helmet()); // Agrega headers de seguridad
app.use(cors(corsOptions));  // Controla quién puede hacer requests a tu API
app.use(express.json()); // Parsear JSON en los body requests
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)); //Swagger UI
app.use('/api/users', userRoutes);  // Rutas de usuarios
app.use('/api/tasks', taskRoutes);
app.use(errorHandler); // Manejo global de errores

// Rutas base
app.get('/', (req, res) => {
  res.send('Bienvenido a la API de Task Manager');
});

// Levantar servidor
app.listen(PORT, HOST, () => {
  console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
});