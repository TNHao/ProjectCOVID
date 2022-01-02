const express = require('express');
const router = express.Router();

const locationController = require('../../controllers/sites/location.controller');

router.get('/', locationController.get);

module.exports = router;