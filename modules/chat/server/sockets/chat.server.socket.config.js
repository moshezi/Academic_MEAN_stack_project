'use strict';



var mongoose = require('mongoose'),
  Chatmessage = mongoose.model('Chatmessage');

// Create the chat configuration
module.exports = function (io, socket) {

  // Emit the status event when a new socket client is connected
  io.emit('chatMessage', {
    type: 'status',
    text: 'is online',
    created: Date.now(),
    profileImageURL: socket.request.user.profileImageURL,
    sender: { _id: socket.request.user.id, username: socket.request.user.username } 
  });

  // Send a chat messages to all connected sockets when a message is received
  socket.on('chatMessage', function (message) {
    message.type = 'message';
    message.created = Date.now();
    message.profileImageURL = socket.request.user.profileImageURL;
    message.sender = socket.request.user.id;

    var newChatMsg = new Chatmessage(message);
    newChatMsg.save(function(err){
    });

    message.sender = { _id: socket.request.user.id, username: socket.request.user.username };
    // Emit the 'chatMessage' event
    io.emit('chatMessage', message);

  });

  // Emit the status event when a socket client is disconnected
  socket.on('disconnect', function () {
    io.emit('chatMessage', {
      type: 'status',
      text: 'went offline',
      created: Date.now(),
      sender: { _id: socket.request.user.id, username: socket.request.user.username }
    });
  });
};
