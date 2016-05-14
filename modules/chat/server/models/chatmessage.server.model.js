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
  username: {
    type: String,
    default: ''
  }
});

mongoose.model('Chatmessage', ChatmessageSchema);
