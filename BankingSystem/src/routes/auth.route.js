const express = require('express');
const passport = require('passport');
const router = express.Router();

const authController = require('../controllers/auth.controller');

// router.get('/register', (req, res, next) => { });
// router.get('/login', (req, res, next) => { });
// router.get('/reset-password', (req, res, next) => { });

router.get('/test-jwt',
    (req, res, next) => {
        passport.authenticate('jwt', { session: false }, (err, user) => {
            if (err || !user)
                res.json({ status: 401, msg: "TOKEN Đâu???" })
            else next();
        })(req, res, next);
    },
    (req, res, next) => {
        res.json({ status: 200, msg: "SUCCESS" })
    }
);

router.post('/verify', authController.verify);

router.post('/register', authController.addNewUser);
router.post('/login', authController.login);
router.post('/create-password', authController.editPassword);

module.exports = router;