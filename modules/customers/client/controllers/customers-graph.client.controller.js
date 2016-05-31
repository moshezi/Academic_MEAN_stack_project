(function() {
'use strict'

angular
  .module('customers')
  .controller('CustomersGraphController',
  ['$scope', 'CustomersService', 'ExpensesService', '$http', '$timeout', 'customerResolve', 'expensesResolve',
    function ($scope, CustomersService, ExpensesService, $http, $timeout, customerResolve, expensesResolve) {
      var vm = this
      $scope.labels = ['Download Sales', 'In-Store Sales', 'Mail Sales'];
      $scope.data = [300, 500, 100];

      $scope.$back = function () {
        window.history.back();
      }
      
      vm.scopep = $scope;

      CustomersService.query(function (results) {
        vm.customers = results;
      })

      ExpensesService.query(function (results) {
        vm.expenses = results;
      });

      vm.customer = customerResolve;

      vm.getExpensesForCustomer = expensesResolve.data;
    }]);
})();