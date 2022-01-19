const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const userModel = require('../models/user/user.model');
const { PERMISSIONS } = require('../constants/index')
const bcrypt = require('bcrypt');

module.exports = (app) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'Username',
        passwordField: 'Password',
      },
      async (username, password, done) => {
        try {
          const { data: user } = await userModel.findByUsername(username);

          if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
          }

          // const validPassword = await bcrypt.compare(password, user.password).then(res => res);
          const validPassword = await bcrypt.compare(password, user.password);
          if (!validPassword) {
            return done(null, false, { message: 'Incorrect password.' });
          }
          if (user.permission == PERMISSIONS['inactiveManager']) {
            return done(null, false, { message: 'Account has been blocked.' });
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    try {
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  app.use(passport.initialize());
  app.use(passport.session());
};
