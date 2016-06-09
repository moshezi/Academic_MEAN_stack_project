(function() {
  'use strict';

  angular
    .module('customers')
    .controller('CustomersYearMonthController',
    ['$scope', 'CustomersService', 'ExpensesService', '$http', '$timeout', 'customerResolve', 'expensesResolve', '$state',
      function ($scope, CustomersService, ExpensesService, $http, $timeout, customerResolve, expensesResolve, $state) {
        $scope.expenses = expensesResolve.data;
        $scope.customer = customerResolve;

        $scope.months = ['January', 'February', 'March', 'April', 'May',
                                       'June', 'July', 'August', 'September', 'October',
                                      'November', 'December'];

        $scope.year = $state.params.year;  
        $scope.month = $state.params.month;

        $scope.$back = function () {
          window.history.back();
        };

      }]);
})();