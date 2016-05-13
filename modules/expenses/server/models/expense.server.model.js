'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Expense Schema
 */
var ExpenseSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill expense name',
    trim: true
  },
  amount: {
    type: Number,
    default: 0,
    required: 'Please fill expense amount'
  },
  picPath: {
    type: String,
    default: '',
  },
  expenseDate: {
    type: Number    
  },
  comments: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    default: '',
  },
  isRecurring: {
    type: Number,
    default: 0
  },
  created: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Expense', ExpenseSchema);
