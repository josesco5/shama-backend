var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var config = require('../config/config');
var User = require('../models/user');

/* POST sign up */
router.post('/sign-up', function(req, res, next) {
  var params = {
    email: req.body.email,
    password: req.body.password
  };
  User.findOne(params, function(err, user) {
    if (err) {
      next(err);
      return;
    }
    if (!user) {
      res.sendStatus(401);
      return;
    }
    var payload = { id: user._id };
    var token = jwt.encode(payload, config.jwtSecret);
    res.json({ token: token });
  });
});

module.exports = router;
