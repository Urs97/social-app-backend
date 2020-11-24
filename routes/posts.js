const express = require('express');

const PostsController = require('../controllers/posts');

const router = express.Router();

router.get('/', PostsController.get_all_posts);
router.post('/', PostsController.create_post);
router.get('/:id', PostsController.get_single_post);
router.patch('/:id', PostsController.update_post);
router.delete('/:id', PostsController.delete_post);
router.patch('/:id/like', PostsController.like_post);
router.patch('/:id/dislike', PostsController.dislike_post);

module.exports = router;