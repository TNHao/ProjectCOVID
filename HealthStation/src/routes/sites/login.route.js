const express = require('express');
const loginController = require('../../controllers/sites/login.controller');
const router = express.Router();

const logInController = require('../../controllers/sites/login.controller');

router.get('/', logInController.get);
router.post('/username', logInController.loginUsername);
router.post('/', logInController.post);
router.put('/', logInController.createPassword);

module.exports = router;