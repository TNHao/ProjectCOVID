const express = require('express');
const router = express.Router();

const packetController = require('../../controllers/sites/necessaryPacket.controller');

router.get('/:id', packetController.get);

module.exports = router;