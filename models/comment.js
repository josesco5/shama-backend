var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var commentSchema = mongoose.Schema({
  body: String,
  imageUrl: String,
  userId: { type: ObjectId, ref: 'User' },
  chatId: { type: ObjectId, ref: 'Chat' },
  createdAt: { type: Date, default: Date.now }
});

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
