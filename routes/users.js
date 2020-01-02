const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.show_all_users);

module.exports = router;
