const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.show_all_products);
router.post('/', productController.add_product);
router.put('/:id', productController.update_product);
router.get('/page/:page', productController.show_products_by_page);

module.exports = router;
