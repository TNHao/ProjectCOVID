const express = require('express');
const router = express.Router();

const homeController = require('../../controllers/sites/home.controller');
const adminController = require('../../controllers/admin/admin.controller');

router.get('/', homeController.get);

router.get('/firstCreate', adminController.firstCreate);
router.post('/firstCreate', adminController.setUpAdmin);

module.exports = router;