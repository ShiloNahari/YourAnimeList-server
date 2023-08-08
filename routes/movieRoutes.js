const express = require('express');
const router = express.Router();

const { getAllMovies, getMovieById, createMovie, updateMovie, deleteMovie, searchMovies } = require('../controllers/movieController');
const { authenticateUser, authorizeUser } = require('../middleware/authentication');

router.get('/search', authenticateUser, authorizeUser(['user','admin']), searchMovies);
router.get('/', getAllMovies);
router.get('/:id', authenticateUser, authorizeUser(['user','admin']), getMovieById);
router.post('/', authenticateUser, authorizeUser(['admin']), createMovie);
router.put('/:id', authenticateUser, authorizeUser(['admin']), updateMovie);
router.delete('/:id', authenticateUser, authorizeUser(['admin']), deleteMovie);

module.exports = router;