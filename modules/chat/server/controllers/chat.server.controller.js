'use strict';

var mongoose = require('mongoose'),
  Chatmessage = mongoose.model('Chatmessage');

module.exports = {
  allmessages: function(req, res) {

    // var lastTenMinutes = new Date(Date.now().getTime() - (MS_PER_MINUTE * 10));

    if (!req.user) {
      res.status(400).send({ error: 'User not logged in' });
    } else {
      var user = req.user;
      if (user.roles.indexOf('advisor') !== -1) {
        // An advisor is asking for messages
        

      } else if (user.roles.indexOf('customer') !== -1) {
          // A customer is asking for messages
          

      } else {
        res.status(400).send({ error: 'User is neither a customer nor an advisor' });
      }
      Chatmessage.find({ $or:[ { user: user.id }, {} ] })
        .populate('sender').populate('to')
    // .where({ createdAt: { $gte: lastTenMinutes } })
      .exec(function(err, data) {
        res.json(data);
      });
    }
    
  }
};