const express = require('express');
const router = express.Router();

const productController = require('../../controllers/sites/product.controller');

router.get('/:id', productController.get);

module.exports = router;