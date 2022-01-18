const express = require('express');
const router = express.Router();

const categoryController = require('../../controllers/sites/category.controller');

router.get('/:id', categoryController.get);

module.exports = router;