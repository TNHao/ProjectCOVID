const express = require('express');
const router = express.Router();


router.get('/unauthorized', (req, res, next) => {
    res.render('error/401')
})

module.exports = router;

