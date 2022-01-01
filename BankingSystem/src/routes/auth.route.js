const express = require('express');
const passport = require('passport');
const router = express.Router();

const authController = require('../controllers/auth.controller');

// router.get('/register', (req, res, next) => { });
// router.get('/login', (req, res, next) => { });
// router.get('/reset-password', (req, res, next) => { });

router.get('/test-jwt', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.json({ status: 200, msg: "SUCCESS" })
});

router.post('/register', authController.addNewUser);
router.post('/login', authController.login);
router.post('/create-password', authController.editPassword);

module.exports = router;