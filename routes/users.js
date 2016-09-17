var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find(function(err, users) {
    if (err) {
      res.send(err);
    }
    res.json(users);
  });
});

/* GET user detail */
router.get('/:id', function(req, res, next) {
  var id = req.params.id;
  User.findById(id, function (err, user) {
    if (err) {
      res.send(err);
    }
    res.json(user);
  });
});

/* POST creating user */
router.post('/', function(req, res, next) {
  User.create(req.body, function(err, user) {
    if (err) {
      res.send(err);
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
router.put('/:id', function(req, res, next) {
  var id = req.params.id;
  var newValues = req.body;
  User.findById(id, function (err, user) {
    if (err) {
      res.send(err);
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
        res.send(err);
      }
      res.json(user);
    });
  });
});

/* DELETE removing user */
router.delete('/:id', function(req, res, next) {
  User.remove({ _id: req.params.id }, function (err) {
    if (err) {
      res.send(err);
    }
    res.send('user deleted');
  });
});

module.exports = router;
