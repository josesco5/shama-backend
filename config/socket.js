
var Message = require('../models/message');

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
  });
};