var express = require('express');
var router = express.Router();
var Chat = require('../models/chat');

/* GET chats listing. */
router.get('/', function(req, res, next) {
  Chat.find(function(err, chats) {
    if (err) {
      res.send(err);
    }
    res.json(chats);
  });
});

/* GET chat detail */
router.get('/:id', function(req, res, next) {
  var id = req.params.id;
  Chat.findById(id, function (err, chat) {
    if (err) {
      res.send(err);
    }
    res.json(chat);
  });
});

/* POST creating chat */
router.post('/', function(req, res, next) {
  Chat.create(req.body, function(err, chat) {
    if (err) {
      res.send(err);
    }
    res.json(chat);
  });
});

/*
 * PUT updating chat
 * Notes:
 *   Overwrites user fields even if the new values are empty.
 *   This function must be used only by admin, supervisors and experts
 */
router.put('/:id', function(req, res, next) {
  var id = req.params.id;
  var newValues = req.body;
  Chat.findById(id, function (err, chat) {
    if (err) {
      res.send(err);
    }
    chat.title = newValues.title;
    chat.theme = newValues.theme;
    chat.assignedTo = newValues.assignedTo;
    chat.enabled = newValues.enabled;
    chat.save(function (err, chat) {
      if (err) {
        res.send(err);
      }
      res.json(chat);
    });
  });
});

/* DELETE removing user */
router.delete('/:id', function(req, res, next) {
  Chat.remove({ _id: req.params.id }, function (err) {
    if (err) {
      res.send(err);
    }
    res.send('chat deleted');
  });
});

module.exports = router;
