'use strict';

/**
 * Module dependencies
 */
var customersPolicy = require('../policies/customers.server.policy'),
  customers = require('../controllers/customers.server.controller');

module.exports = function(app) {
  // Customers Routes
  app.route('/api/customers').all(customersPolicy.isAllowed)
    .get(customers.list);

  app.route('/api/customers/:customerId').all(customersPolicy.isAllowed)
    .get(customers.read)
    .put(customers.update)
    .delete(customers.delete);

  app.route('/api/customer-month-category-expenses/:customerId/:month/:category')
    .get(customers.customerMonthCategoryExpenses);
  
  app.route('/api/customer-month-week-expenses/:customerId/:month/:week')
    .get(customers.customerMonthWeekExpenses);

  app.route('/api/customer-year-month-expenses/:customerId/:year/:month')
    .get(customers.customerYearMonthExpenses);

  // Finish by binding the Customer middleware
  app.param('customerId', customers.customerByID);
};
