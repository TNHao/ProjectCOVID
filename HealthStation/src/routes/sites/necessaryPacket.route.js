const express = require('express');
const router = express.Router();

const packetController = require('../../controllers/sites/necessaryPacket.controller');

router.get('/search', packetController.search);
router.get('/:id', packetController.get);

module.exports = router;