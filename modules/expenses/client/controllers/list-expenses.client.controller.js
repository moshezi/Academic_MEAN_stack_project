(function () {
  'use strict';

  angular
    .module('expenses')
    .controller('ExpensesListController', ExpensesListController);

  ExpensesListController.$inject = ['ExpensesService'];

  function ExpensesListController(ExpensesService) {
    var vm = this;

    vm.expenses = ExpensesService.query();
  }
})();
