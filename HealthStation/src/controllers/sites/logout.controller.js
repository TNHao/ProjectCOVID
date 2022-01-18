const passport = require('passport');

module.exports = {
    get: async (req, res) => {
        req.logout();

        res.redirect('/')
    }
}