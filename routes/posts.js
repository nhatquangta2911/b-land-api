const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/', postController.show_all_posts);

module.exports = router;
