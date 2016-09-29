var express = require('express');
var jwt = require('jwt-simple');
var config = require('../config/config');
var auth = require('../config/auth')();
var router = express.Router();
var User = require('../models/user');
var Chat = require('../models/chat');


/* GET users listing. */
router.get('/', auth.authenticate(), function(req, res, next) {
  User.find(function(err, users) {
    if (err) {
      next(err);
    }
    res.json(users);
  });
});

/* GET current user */
router.get('/me', auth.authenticate(), function(req, res, next) {
  var token = req.headers.authorization.split(' ')[1];
  var decoded = jwt.decode(token, config.jwtSecret);
  var id = decoded.id;
  User.findById(id, function (err, user) {
    if (err) {
      err.status = 404;
      next(err);
    }
    res.json(user);
  });
});

/* GET user detail */
router.get('/:id', auth.authenticate(), function(req, res, next) {
  var id = req.params.id;
  User.findById(id, function (err, user) {
    if (err) {
      err.status = 404;
      next(err);
    }
    res.json(user);
  });
});

/* POST creating user */
router.post('/', auth.authenticate(), function(req, res, next) {
  User.create(req.body, function(err, user) {
    if (err) {
      err.status = 400;
      next(err);
    }
    res.json(user);
  });
});

/*
 * PUT updating user
 * Notes:
 *   Overwrites user fields even if the new values are empty.
 *   This function must be used only by admin
 */
router.put('/:id', auth.authenticate(), function(req, res, next) {
  var id = req.params.id;
  var newValues = req.body;
  User.findById(id, function (err, user) {
    if (err) {
      err.status = 404;
      next(err);
      return;
    }
    user.name = newValues.name;
    user.lastname = newValues.lastname;
    user.identityCard = newValues.identityCard;
    user.email = newValues.email;
    user.gender = newValues.gender;
    user.specialty = newValues.specialty;
    user.career = newValues.career;
    user.role = newValues.role;
    user.enabled = newValues.enabled;
    user.comments = newValues.comments;
    user.save(function (err, user) {
      if (err) {
        err.status = 400;
        next(err);
      }
      res.json(user);
    });
  });
});

/* DELETE removing user */
router.delete('/:id', auth.authenticate(), function(req, res, next) {
  User.remove({ _id: req.params.id }, function (err) {
    if (err) {
      next(err);
      return;
    }
    res.send('user deleted');
  });
});

/* GET user detail */
router.get('/:id/chats', auth.authenticate(), function(req, res, next) {
  var id = req.params.id;
  Chat.find({ assignedTo: id }, function(err, chats) {
    if (err) {
      err.status = 404;
      next(err);
      return;
    }
    res.json(chats);
  });
});

module.exports = router;
