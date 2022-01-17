const session = require('express-session');

module.exports = (app) => {
    app.use(session({
        secret: 'random string',
        resave: false,
        saveUninitialized: true,
        cookie: {
            path: '/',
            httpOnly: false,
            maxAge: 24 * 60 * 60 * 1000
        },
    }))
}