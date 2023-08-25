const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/userController');
const { authenticateUser, authorizeUser } = require('../middleware/authentication');

router.get('/', authenticateUser, authorizeUser(['admin']), getAllUsers);
router.get('/:id',  getUserById);
router.post('/', authenticateUser, authorizeUser(['admin']), createUser);
router.put('/:id', authenticateUser, authorizeUser(['admin']), updateUser);
router.delete('/:id', authenticateUser, authorizeUser(['admin']), deleteUser);

module.exports = router;