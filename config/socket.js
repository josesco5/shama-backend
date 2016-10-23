
var User = require('../models/user');
var Message = require('../models/message');
var Comment = require('../models/comment');

module.exports = function(io) {
  io.on('connection', function(socket) {
    var currentChat;

    socket.on('join chat', function (chatId) {
      if (currentChat && currentChat !== chatId) {
        socket.leave(currentChat);
      }
      socket.join(chatId);
      currentChat = chatId;
    });

    socket.on('message', function (msg) {
      // ToDo: Manage errors
      Message.create(msg, function(err, message) {
        io.to(message.chatId).emit('message', message);
      });
    });

    socket.on('comment', function (comm) {
      // ToDo: Manage errors
      Comment.create(comm, function(err, comment) {
        User.findById(comment.userId, function (err, user) {
          comment.userId = user;
          io.to(comment.chatId).emit('comment', comment);
        });
      });
    });
  });
};
