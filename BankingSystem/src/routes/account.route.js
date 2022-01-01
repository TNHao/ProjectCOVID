const express = require('express');
const router = express.Router();

const accountController = require('../controllers/account.controller');

router.get('/:id/get-balance', accountController.getBalance);
router.get('/change-password', accountController.changePassword);

module.exports = router;