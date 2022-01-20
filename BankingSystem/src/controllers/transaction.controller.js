const { DEPOSIT, WITHDRAWAL, ADMIN_ID, PAYMENT } = require('../constants');
const transactionModel = require('../models/transaction');

module.exports = {
    newTransaction: async (req, res) => {
        const { send_id, amount, action } = req.body;
        const transaction = { send_id, amount, action }

        try {
            const { data } = await transactionModel.newTransaction(transaction);

            res.json({ status: 200, msg: "SUCCESS", data });
        } catch (error) {
            res.json({ status: 400, msg: error });
        }
    },
    deposit: async (req, res) => {
        const { send_id, amount } = req.body;
        const transaction = { send_id, amount, action: DEPOSIT }
        console.log(transaction);
        try {
            const dummy = await transactionModel.updateBalance(send_id, amount);
            console.log('dummy', dummy);
            const { data } = await transactionModel.newTransaction(transaction);
            console.log('transaction', dummy, data);

            res.json({ status: 200, msg: "SUCCESS", data });
        } catch (error) {
            res.json({ status: 400, msg: error });
        }
    },
    withdrawal: async (req, res) => {
        const { send_id, amount } = req.body;
        const transaction = { send_id, amount, action: WITHDRAWAL }

        try {
            await transactionModel.updateBalance(send_id, -1 * amount);

            const { data } = await transactionModel.newTransaction(transaction);

            res.json({ status: 200, msg: "SUCCESS", data });
        } catch (error) {
            res.json({ status: 400, msg: error });
        }
    },
    payment: async (req, res) => {
        const { send_id, amount } = req.body;
        const transaction = { send_id, amount, action: PAYMENT }

        try {
            await transactionModel.updateBalance(send_id, -1 * amount);
            await transactionModel.updateBalance(ADMIN_ID, amount);

            const { data } = await transactionModel.newTransaction(transaction);

            res.json({ status: 200, msg: "SUCCESS", data });
        } catch (error) {
            res.json({ status: 400, msg: error });
        }
    },
    getPayment: async (req, res) => {
        try {
            const { data } = await transactionModel.getTransaction(req.params.id);
            res.json({ status: 200, msg: "SUCCESS", data });
        } catch (error) {
            res.json({ status: 400, msg: error });
        }
    }
}