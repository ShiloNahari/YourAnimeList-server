const express = require('express');
const router = express.Router();
const {getAllComments,postComment} = require('../controllers/commentController')

router.get('/', getAllComments)
router.post('/',postComment)

module.exports = router;