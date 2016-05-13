(function () {
  'use strict';

  angular
    .module('customers')
    .controller('CustomersListController', CustomersListController);

  CustomersListController.$inject = ['CustomersService', 'ExpensesService'];

  function CustomersListController(CustomersService, ExpensesService) {
    var vm = this;

    vm.customers = CustomersService.query();
    vm.expenses = ExpensesService.query();
  }
})();
