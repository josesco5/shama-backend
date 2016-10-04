var express = require('express');
var jwt = require('jwt-simple');
var config = require('../config/config');
var auth = require('../config/auth')();
var router = express.Router();
var User = require('../models/user');
var Chat = require('../models/chat');


/*
 * GET users listing. Used to get the team or adolescent list
 * URL Params:
 *   role: User's role who makes the request
 *   type: Users' type to be queried (adolescent or team)
 * ToDo:
 *   Get user's role from the token
 */
router.get('/', auth.authenticate(), function(req, res, next) {
  var role = req.query.role;
  var type = req.query.type;
  var params = {};
  if (type === 'adolescent') {
    if (role === 'admin') {
      params = {
        role: 'adolescent'
      };
    } else {
      res.sendStatus(401);
      return;
    }
  } else if (type === 'team') {
    if (role === 'admin') {
      params = {
        role: { $in: ['supervisor', 'expert'] }
      };
    } else if (role === 'supervisor') {
      params = {
        role: 'expert'
      };
    } else {
      res.sendStatus(401);
      return;
    }
  }
  User.find(params, function(err, users) {
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

/*
 * POST enable/disable user
 * Notes:
 *   This function must be used only by admin or supervisor
 */
router.post('/:id/enable', auth.authenticate(), function(req, res, next) {
  var id = req.params.id;
  var enabled = req.body.enabled;
  User.findById(id, function (err, user) {
    if (err) {
      err.status = 404;
      next(err);
      return;
    }
    user.enabled = enabled;
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
