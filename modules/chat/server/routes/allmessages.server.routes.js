'use strict';

var mongoose = require('mongoose'),
  Chatmessage = mongoose.model('Chatmessage');

var MS_PER_MINUTE = 60000;

module.exports = function(app) {
  // Routing logic

  app.get('/chat/allmessages', function(req, res) {

    // var lastTenMinutes = new Date(Date.now().getTime() - (MS_PER_MINUTE * 10));

    Chatmessage.find()
    // .where({ createdAt: { $gte: lastTenMinutes } })
      .exec(function(err, data) {
        res.json(data);
      });
  });
};
