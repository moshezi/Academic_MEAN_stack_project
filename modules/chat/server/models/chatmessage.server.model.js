'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Chatmessage Schema
 */
var ChatmessageSchema = new Schema({
  // Chatmessage model fields
  type: {
    type: String,
    default: ''
  },
  text: {
    type: String,
    default: ''
  },
  created: {
    type: Date,
    default: Date.now
  },
  profileImageURL: {
    type: String,
    default: ''
  },
  to: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  sender: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Chatmessage', ChatmessageSchema);
