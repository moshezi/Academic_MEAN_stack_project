'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Customer = mongoose.model('Customer'),
  User = mongoose.model('User'),
  Expense = mongoose.model('Expense'),
  ObjectId = require('mongoose').Types.ObjectId,
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Show the current Customer
 */
exports.read = function(req, res) {
    // convert mongoose document to JSON
  var customer = req.customer ? req.customer.toJSON() : {};

    // Add a custom field to the Article, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  customer.isCurrentUserOwner = req.user && customer.user && customer.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(customer);
};

/**
 * Update a Customer
 */
exports.update = function(req, res) {
  var customer = req.customer;

  customer = _.extend(customer, req.body);

  customer.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customer);
    }
  });
};

/**
 * Delete an Customer
 */
exports.delete = function(req, res) {
  var customer = req.customer;

  customer.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customer);
    }
  });
};

/**
 * List of Customers
 */
exports.list = function(req, res) {
  if (!req.user) {
    return res.status(400).send({
      'error': 'User is not authorized'
    });
  }

  User.find({
    'advisor': req.user.id
  }).sort().populate('advisor').exec(function(err, customers) {
        // Customer.find().sort('-created').populate('user', 'displayName').exec(function(err, customers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customers);
    }
  });
};

var filterExpensesByMonthAndCategory = function (expenses, month, category) {
  var monthCategoryExpenses = expenses.filter(function(expense) {
    var date = new Date(expense.expenseDate);  
    if (date.getMonth() === month && expense.category === category) {
      return expense;
    }
  });
  return monthCategoryExpenses;
};

var filterExpensesByMonthAndWeek = function (expenses, month, week) {
  var monthWeekExpenses = expenses.filter(function(expense) {
    var date = new Date(expense.expenseDate);
    var expenseWeek = 0 | date.getDate() / 7;
    expenseWeek = (expenseWeek > 3) ? 3 : expenseWeek;  
    if (date.getMonth() === month && expenseWeek === week) {
      return expense;
    }
  });
  return monthWeekExpenses;
};

exports.customerMonthWeekExpenses = function(req, res) {
  var customerId = req.params.customerId;
  var month = req.params.month;
  var week = req.params.week;
  
  Expense.find({
    'user': customerId
  }).sort().populate('user').exec(function(err, expenses) {
        // Customer.find().sort('-created').populate('user', 'displayName').exec(function(err, customers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var monthWeekExpenses = filterExpensesByMonthAndWeek(expenses, +month, (+week) - 1);
      
      res.jsonp(monthWeekExpenses);
    }
  });
};

exports.customerMonthCategoryExpenses = function(req, res) {
  var customerId = req.params.customerId;
  var month = req.params.month;
  var category = req.params.category;
  
  Expense.find({
    'user': customerId
  }).sort().populate('user').exec(function(err, expenses) {
        // Customer.find().sort('-created').populate('user', 'displayName').exec(function(err, customers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var monthCategoryExpenses = filterExpensesByMonthAndCategory(expenses, +month, category);
      
      res.jsonp(monthCategoryExpenses);
    }
  });

  // res.jsonp(req.customer);

  // res.status(200).send(customerId + ' ' + month + ' ' + category);
};

/**
 * Customer middleware
 */
exports.customerByID = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Customer is invalid'
    });
  }

  User.findById(id).populate('advisor', 'displayName').exec(function(err, customer) {
    if (err) {
      return next(err);
    } else if (!customer) {
      return res.status(404).send({
        message: 'No Customer with that identifier has been found'
      });
    }
    req.customer = customer;
    next();
  });
};