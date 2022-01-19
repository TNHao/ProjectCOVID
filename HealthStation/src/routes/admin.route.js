const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin/admin.controller');

router.get('/', adminController.get);
router.get('/account-management', adminController.getAccount);
router.get('/account-management/:id/', adminController.getAccountHistory);

router.get('/isolation-ward', adminController.getIsolationWard);
router.post('/isolation-ward', adminController.createIsolationWard);
router.put('/isolation-ward', adminController.updateIsolationWard);
router.delete('/isolation-ward', adminController.deleteIsolationWard);

module.exports = router;