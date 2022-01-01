const passport = require('passport');
const authRoute = require('./auth.route');
const transactionRoute = require('./transaction.route');
const accountRoute = require('./account.route');

function route(app) {
   app.use('/auth', authRoute);
   app.use('/api/transactions', passport.authenticate('jwt', { session: false }), transactionRoute);
   app.use('/api/accounts', passport.authenticate('jwt', { session: false }), accountRoute);
}

module.exports = route;