const express = require('express');
const router = express.Router();

const managerController = require('../controllers/manager/manager.controller');

router.get('/', managerController.get);
router.get('/account-management', managerController.getAccount);
router.get('/account-management/:id/history', managerController.getAccountHistory);
router.get('/account-management/:id', managerController.getAccountEdit);
router.get('/category-management', managerController.getCategory);
router.post('/category-management', managerController.createCategory);
router.put('/category-management', managerController.updateCategory);
router.delete('/category-management', managerController.deleteCategory);

module.exports = router;