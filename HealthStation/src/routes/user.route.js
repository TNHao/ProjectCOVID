const express = require('express');
const router = express.Router();

const userController = require('../controllers/user/user.controller');

router.post('/order', userController.order);
router.get('/:id/profile', userController.getProfile);
router.get('/:id/payment', userController.getPayment);
router.get('/:id/management', userController.getManagement);
router.get('/:id/purchase', userController.getPurchase);
router.get('/:id/change-password', userController.getChangePassword);
router.post('/:id/change-password', userController.postChangePassword);
router.post('/:id/deposit', userController.deposit);
router.post('/:id/set-token', userController.setToken);

module.exports = router;