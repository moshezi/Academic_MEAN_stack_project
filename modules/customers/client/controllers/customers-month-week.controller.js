(function() {
  'use strict';

  angular
    .module('customers')
    .controller('CustomersMonthWeekController',
    ['$scope', 'CustomersService', 'ExpensesService', '$http', '$timeout', 'customerResolve', 'expensesResolve',
      function ($scope, CustomersService, ExpensesService, $http, $timeout, customerResolve, expensesResolve) {
        $scope.expenses = expensesResolve.data;
        $scope.customer = customerResolve;

        $scope.$back = function () {
          window.history.back();
        };

      }]);
})();