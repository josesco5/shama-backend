var express = require('express');
var router = express.Router();
var Chat = require('../models/chat');
var Message = require('../models/message');
var Comment = require('../models/comment');
var auth = require('../config/auth')();

/* GET chats listing. */
router.get('/', auth.authenticate(), function(req, res, next) {
  var type = req.query.type;
  var params = {};

  if (type) {
    params.type = type;
  }

  Chat.find(params)
    .populate('assignedTo')
    .exec(function(err, chats) {
      if (err) {
        next(err);
      }
      res.json(chats);
    });
});

/* GET chat detail */
router.get('/:id', auth.authenticate(), function(req, res, next) {
  var id = req.params.id;
  Chat.findById(id)
    .populate('assignedTo')
    .exec(function (err, chat) {
      if (err) {
        err.status = 404;
        next(err);
      }
      res.json(chat);
    });
});

/* POST creating chat */
router.post('/', auth.authenticate(), function(req, res, next) {
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
router.put('/:id', auth.authenticate(), function(req, res, next) {
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

/*
 * POST enable/disable chat
 * Notes:
 *   This function must be used only by admin or supervisor
 */
router.post('/:id/enable', auth.authenticate(), function(req, res, next) {
  var id = req.params.id;
  var enabled = req.body.enabled;
  Chat.findById(id, function (err, chat) {
    if (err) {
      err.status = 404;
      next(err);
      return;
    }
    chat.enabled = enabled;
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
router.delete('/:id', auth.authenticate(), function(req, res, next) {
  Chat.remove({ _id: req.params.id }, function (err) {
    if (err) {
      next(err);
      return;
    }
    res.send('chat deleted');
  });
});

/* GET chat's messages */
router.get('/:id/messages', auth.authenticate(), function(req, res, next) {
  var id = req.params.id;
  Message.find({ chatId: id })
    .populate('userId')
    .exec(function(err, messages) {
      if (err) {
        next(err);
        return;
      }
      res.json(messages);
    });
});

/* GET chat's comments */
router.get('/:id/comments', auth.authenticate(), function(req, res, next) {
  var id = req.params.id;
  Comment.find({ chatId: id })
    .populate('userId')
    .exec(function(err, comments) {
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
router.post('/:id/vote/:optionId', auth.authenticate(), function(req, res, next) {
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
