const express = require('express');
const router = express.Router();
const { getAllComments, postComment, getCommentsByAnimeId, } = require('../controllers/commentController')

router.get('/', getAllComments)
router.get('/:id', getCommentsByAnimeId)
router.post('/',postComment)

module.exports = router;