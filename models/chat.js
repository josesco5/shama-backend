var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var chatSchema = mongoose.Schema({
  title: { type: String, required: true },
  assignedTo: { type: ObjectId, ref: 'User' },
  theme: String,
  type: { type: String, required: true },
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
