const express = require('express');
const router = express.Router();

const productController = require('../../controllers/sites/product.controller');

router.get('/', productController.get);

module.exports = router;