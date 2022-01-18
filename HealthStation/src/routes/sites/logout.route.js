const express = require('express');
const router = express.Router();

const logOutController = require('../../controllers/sites/logout.controller');

router.get('/', logOutController.get);

module.exports = router;