var express = require('express');
var router = express.Router();
var Message = require('../models/message');

/* GET messages listing. */
router.get('/', function(req, res, next) {
  Message.find(function(err, messages) {
    if (err) {
      res.send(err);
    }
    res.json(messages);
  });
});

/* POST creating message */
router.post('/', function(req, res, next) {
  Message.create(req.body, function(err, message) {
    if (err) {
      res.send(err);
    }
    res.json(message);
  });
});

/*
 * PUT updating messages
 * Notes:
 *   Overwrites user fields even if the new values are empty.
 */
router.put('/:id', function(req, res, next) {
  var id = req.params.id;
  var newValues = req.body;
  Message.findById(id, function (err, message) {
    if (err) {
      res.send(err);
    }
    message.body = newValues.body;
    message.imageUrl = newValues.imageUrl;
    message.visible = newValues.visible;
    message.save(function (err, message) {
      if (err) {
        res.send(err);
      }
      res.json(message);
    });
  });
});

/* DELETE removing message */
router.delete('/:id', function(req, res, next) {
  Message.remove({ _id: req.params.id }, function (err) {
    if (err) {
      res.send(err);
    }
    res.send('message deleted');
  });
});

module.exports = router;
