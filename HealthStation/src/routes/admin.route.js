const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin/admin.controller');

router.get('/', adminController.get);
router.get('/account-management', adminController.getAccount);
router.get('/account-management/:id/', adminController.getAccountHistory);
router.get('/isolation-ward', adminController.getIsolationWard);
router.get('/firstCreate', adminController.firstCreate);
router.post('/firstCreate', adminController.setUpAdmin);
module.exports = router;
