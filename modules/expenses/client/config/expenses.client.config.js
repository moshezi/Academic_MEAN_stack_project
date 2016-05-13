(function () {
  'use strict';

  angular
  .module('expenses')
  .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Expenses',
      state: 'expenses',
      type: 'dropdown',
      roles: ['admin', 'customer']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'expenses', {
      title: 'List Expenses',
      state: 'expenses.list',
      roles: ['admin', 'customer']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'expenses', {
      title: 'Manage Advisors',
      state: 'expenses.advisors',
      roles: ['admin', 'customer']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'expenses', {
      title: 'Create Expense',
      state: 'expenses.create',
      roles: ['admin', 'customer']
    });
  }
})();
