const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { SECRET_KEY } = require('../constants');
const authModel = require('../models/auth');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET_KEY,
  ignoreExpiration: false,
};

module.exports = (app) => {
  passport.use(new JwtStrategy(options, async function (jwt_payload, done) {

    const id = jwt_payload.sub;
    const exp = jwt_payload.exp;

    try {
      const { data } = await authModel.findUser(id);
      if (data)
        return done(null, data)
      else
        return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  }));

  app.use(passport.initialize());
}