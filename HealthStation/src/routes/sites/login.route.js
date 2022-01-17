const express = require('express');
const router = express.Router();

const logInController = require('../../controllers/sites/login.controller');

router.get('/', logInController.get);
router.post('/', logInController.post);

module.exports = router;