(function () {
  'use strict';

  angular
    .module('customers')
    .controller('CustomersListController',
    ['$scope', 'CustomersService', 'ExpensesService', '$http', '$timeout',
      function ($scope, CustomersService, ExpensesService, $http, $timeout) {
        var vm = this;
        vm.scope = $scope;

        CustomersService.query(function (results) {
          vm.customers = results
        });
        ExpensesService.query(function (results) {
          vm.expenses = results
        });

        vm.showGraph = function (customer) {

        };

        vm.getExpensesForCustomer = function (customerId) {
          vm.currentCustomerExpenses = []
          $http.get('/api/user-expenses/' + customerId).then(function (results) {
            $timeout(function () { vm.currentCustomerExpenses = results.data })
          })
        }
      }]);
})();