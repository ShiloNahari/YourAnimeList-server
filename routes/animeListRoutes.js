const express = require('express');
const router = express.Router();

const { getMyAnimeList, addAnimeToList, updateStatusAndRating, deleteAnimeFromList } = require('../controllers/animeListController');
const { authenticateUser, authorizeUser } = require('../middleware/authentication');

router.get('/', getMyAnimeList);
router.post('/', authenticateUser, authorizeUser(['user']), addAnimeToList);
router.put('/:id', authenticateUser, updateStatusAndRating);
router.delete('/:id', authenticateUser, authorizeUser(['user']), deleteAnimeFromList);

module.exports = router;