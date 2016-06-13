'use strict';

var chat = require('../controllers/chat.server.controller');

var MS_PER_MINUTE = 60000;

module.exports = function(app) {
  // Routing logic

  app.get('/chat/allmessages', chat.allmessages);
  app.put('/chat/allmessages', chat.newMessage);
};
