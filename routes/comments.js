const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');
router.post('/add/:discussionId', authMiddleware.authMiddleware, commentController.addComment);
router.get('/:discussionId', commentController.getComments);

module.exports = router;