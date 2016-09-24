var express = require('express');
var router = express.Router();
var Message = require('../models/message');
var auth = require('../config/auth')();

/* GET messages listing. */
router.get('/', auth.authenticate(), function(req, res, next) {
  Message.find(function(err, messages) {
    if (err) {
      next(err);
    }
    res.json(messages);
  });
});

/* POST creating message */
router.post('/', auth.authenticate(), function(req, res, next) {
  Message.create(req.body, function(err, message) {
    if (err) {
      err.status = 400;
      next(err);
    }
    res.json(message);
  });
});

/*
 * PUT updating messages
 * Notes:
 *   Overwrites user fields even if the new values are empty.
 */
router.put('/:id', auth.authenticate(), function(req, res, next) {
  var id = req.params.id;
  var newValues = req.body;
  Message.findById(id, function (err, message) {
    if (err) {
      err.status = 404;
      next(err);
      return;
    }
    message.body = newValues.body;
    message.imageUrl = newValues.imageUrl;
    message.visible = newValues.visible;
    message.save(function (err, message) {
      if (err) {
        err.status = 400;
        next(err);
      }
      res.json(message);
    });
  });
});

/* DELETE removing message */
router.delete('/:id', auth.authenticate(), function(req, res, next) {
  Message.remove({ _id: req.params.id }, function (err) {
    if (err) {
      next(err);
      return;
    }
    res.send('message deleted');
  });
});

module.exports = router;
