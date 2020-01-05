const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.show_all_products);

module.exports = router;
