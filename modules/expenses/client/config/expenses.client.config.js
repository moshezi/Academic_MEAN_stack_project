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
      roles: ['user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'expenses', {
      title: 'List Expenses',
      state: 'expenses.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'expenses', {
      title: 'Create Expense',
      state: 'expenses.create',
      roles: ['user']
    });
  }
})();
