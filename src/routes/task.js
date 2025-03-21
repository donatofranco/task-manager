const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task');
const authenticateToken = require('../middlewares/auth');

// CRUD Routes con autenticación
router.post('/', authenticateToken, taskController.createTask);
router.get('/', authenticateToken, taskController.getTasks);
router.get('/:id', authenticateToken, taskController.getTaskById);
router.put('/:id', authenticateToken, taskController.updateTask);
router.delete('/:id', authenticateToken, taskController.deleteTask);

module.exports = router;
