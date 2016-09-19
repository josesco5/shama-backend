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
  questions: [
    {
      title: String,
      options: [
        { title: String, votes: { type: Number, default: 0 }}
      ]
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

var Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
