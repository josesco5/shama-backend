var passport = require('passport');
var passportJWT = require('passport-jwt');
var User = require('../models/user');
var config = require('./config');

var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;
var params = {
  secretOrKey: config.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeader()
};

module.exports = function() {
  var strategy = new Strategy(params, function(payload, done) {
    User.findById(payload.id, function (err, user) {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, { id: user._id });
      } else {
        return done(new Error('User not found'), null);
      }
    });
  });

  passport.use(strategy);
  return {
    initialize: function() {
      return passport.initialize();
    },
    authenticate: function() {
      return passport.authenticate('jwt', config.jwtSession);
    }
  };
};
