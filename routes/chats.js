var express = require('express');
var router = express.Router();
var Chat = require('../models/chat');
var Message = require('../models/message');
var Comment = require('../models/comment');

/* GET chats listing. */
router.get('/', function(req, res, next) {
  Chat.find(function(err, chats) {
    if (err) {
      next(err);
    }
    res.json(chats);
  });
});

/* GET chat detail */
router.get('/:id', function(req, res, next) {
  var id = req.params.id;
  Chat.findById(id, function (err, chat) {
    if (err) {
      err.status = 404;
      next(err);
    }
    res.json(chat);
  });
});

/* POST creating chat */
router.post('/', function(req, res, next) {
  Chat.create(req.body, function(err, chat) {
    if (err) {
      err.status = 400;
      next(err);
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
      err.status = 404;
      next(err);
      return;
    }
    chat.title = newValues.title;
    chat.theme = newValues.theme;
    chat.assignedTo = newValues.assignedTo;
    chat.questions = newValues.questions;
    chat.enabled = newValues.enabled;
    chat.save(function (err, chat) {
      if (err) {
        err.status = 400;
        next(err);
      }
      res.json(chat);
    });
  });
});

/* DELETE removing user */
router.delete('/:id', function(req, res, next) {
  Chat.remove({ _id: req.params.id }, function (err) {
    if (err) {
      next(err);
      return;
    }
    res.send('chat deleted');
  });
});

/* GET chat's messages */
router.get('/:id/messages', function(req, res, next) {
  var id = req.params.id;
  Message.find({ chatId: id }, function(err, messages) {
    if (err) {
      next(err);
      return;
    }
    res.json(messages);
  });
});

/* GET chat's comments */
router.get('/:id/comments', function(req, res, next) {
  var id = req.params.id;
  Comment.find({ chatId: id }, function(err, comments) {
    if (err) {
      next(err);
      return;
    }
    res.json(comments);
  });
});

/*** Surveys ***/

/*
 * POST make a vote on a survey
 * Notes:
 *   It suposes that there is one question in the survey
 */
router.post('/:id/vote/:optionId', function(req, res, next) {
  var id = req.params.id;
  var selectedOptionId = req.params.optionId;
  var newValues = req.body;
  Chat.findById(id, function (err, chat) {
    if (err) {
      err.status = 404;
      next(err);
      return;
    }
    var options = chat.questions[0].options;
    for (var i = 0; i < options.length; i++) {
      var option = options[i];
      if (option._id == selectedOptionId) {
        option.votes++;
        break;
      }
    }
    chat.save(function (err, chat) {
      if (err) {
        next(err);
      }
      res.json(chat);
    });
  });
});

module.exports = router;
