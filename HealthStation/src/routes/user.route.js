const express = require('express');
const router = express.Router();

const userController = require('../controllers/user/user.controller');

router.get('/:id/profile', userController.getProfile);
router.get('/:id/payment', userController.getPayment);
router.get('/:id/change-password', userController.getChangePassword);

module.exports = router;