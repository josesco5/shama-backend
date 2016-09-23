var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var messageSchema = mongoose.Schema({
  body: String,
  imageUrl: String,
  userId: { type: ObjectId, ref: 'User', required: true },
  chatId: { type: ObjectId, ref: 'Chat', required: true },
  visible: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

var Message = mongoose.model('Message', messageSchema);

module.exports = Message;
