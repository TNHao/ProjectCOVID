const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin/admin.controller');

router.get('/', adminController.get);
router.get('/account-management', adminController.getAccount);
router.get('/isolation-ward', adminController.getIsolationWard);

module.exports = router;