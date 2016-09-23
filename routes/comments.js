var express = require('express');
var router = express.Router();
var Comment = require('../models/comment');

/* GET comments listing. */
router.get('/', function(req, res, next) {
  Comment.find(function(err, comments) {
    if (err) {
      next(err);
    }
    res.json(comments);
  });
});

/* POST creating comment */
router.post('/', function(req, res, next) {
  Comment.create(req.body, function(err, comment) {
    if (err) {
      err.status = 400;
      next(err);
    }
    res.json(comment);
  });
});

/*
 * PUT updating comments
 * Notes:
 *   Overwrites user fields even if the new values are empty.
 */
router.put('/:id', function(req, res, next) {
  var id = req.params.id;
  var newValues = req.body;
  Comment.findById(id, function (err, comment) {
    if (err) {
      err.status = 404;
      next(err);
      return;
    }
    comment.body = newValues.body;
    comment.imageUrl = newValues.imageUrl;
    comment.save(function (err, comment) {
      if (err) {
        err.status = 400;
        next(err);
      }
      res.json(comment);
    });
  });
});

/* DELETE removing comment */
router.delete('/:id', function(req, res, next) {
  Comment.remove({ _id: req.params.id }, function (err) {
    if (err) {
      next(err);
      return;
    }
    res.send('comment deleted');
  });
});

module.exports = router;
