var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var chatSchema = mongoose.Schema({
  title: String,
  assignedTo: { type: ObjectId, ref: 'User' },
  theme: String,
  type: String,
  status: String,
  enabled: Boolean,
  createdAt: { type: Date, default: Date.now }
});

var Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
