var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var messageSchema = mongoose.Schema({
  body: String,
  imageUrl: String,
  userId: { type: ObjectId, ref: 'User' },
  chatId: { type: ObjectId, ref: 'Chat' },
  visible: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

var Message = mongoose.model('Message', messageSchema);

module.exports = Message;
