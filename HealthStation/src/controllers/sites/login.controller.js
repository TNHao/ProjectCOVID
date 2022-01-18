const passport = require('passport');

module.exports = {
    get: async (req, res) => {
        if (res.locals.isLoggedIn)
            return res.redirect('/');

        res.render('layouts/sites/login',
            {
                layout: false,
            }
        )
    },
    post: async (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                return res.render('layouts/sites/login', {
                    error: { status: true, msg: err }
                });
            }

            if (!user) {
                res.render('layouts/sites/login', {
                    error: { status: true, msg: info.message }
                });
                return;
            }

            const { permission, username, account_id } = user

            req.logIn({ permission, username, account_id }, function (err) {
                if (err) {
                    res.render('layouts/sites/login', {
                        error: { status: true, msg: err }
                    });
                }
                else {
                    return res.redirect('/');
                }
            });
        })(req, res, next);
    }
}