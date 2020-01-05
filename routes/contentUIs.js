const express = require('express');
const router = express.Router();
const contentUIController = require('../controllers/contentUIController');

router.get('/', contentUIController.show_current_content_ui);

module.exports = router;
