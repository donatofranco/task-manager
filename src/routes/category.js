const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category');
const authenticateToken = require('../middlewares/auth');
const { body } = require('express-validator');

// Validación para la creación y actualización de categorías
const categoryValidation = [
  body('name')
    .notEmpty()
    .withMessage('El nombre de la categoría es obligatorio')
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  body('color')
    .optional()
    .isString()
    .withMessage('El color debe ser un texto')
];

// CRUD Routes con autenticación
router.post('/', authenticateToken, categoryValidation, categoryController.createCategory);
router.get('/', authenticateToken, categoryController.getCategories);
router.get('/:id', authenticateToken, categoryController.getCategoryById);
router.put('/:id', authenticateToken, categoryValidation, categoryController.updateCategory);
router.delete('/:id', authenticateToken, categoryController.deleteCategory);

module.exports = router;