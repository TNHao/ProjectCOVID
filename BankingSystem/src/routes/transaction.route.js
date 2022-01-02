const express = require('express');
const router = express.Router();

const transactionController = require('../controllers/transaction.controller');

router.post('/', transactionController.newTransaction);
router.post('/deposit', transactionController.deposit);
router.post('/withdrawal', transactionController.withdrawal);
router.post('/payment', transactionController.payment);

router.get('/history/:id', transactionController.getPayment);
module.exports = router;