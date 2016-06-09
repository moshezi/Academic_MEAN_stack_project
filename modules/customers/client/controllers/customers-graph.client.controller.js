(function () {
  'use strict';

  angular
    .module('customers')
    .controller('CustomersGraphController',
    ['$scope', 'CustomersService', 'ExpensesService', '$http', '$timeout', 'customerResolve', 'expensesResolve',
      function ($scope, CustomersService, ExpensesService, $http, $timeout, customerResolve, expensesResolve) {
        var vm = this;
        
        $scope.categories = [];
        $scope.categoryValues = [];

        var refreshData = function() {
          // $scope.labelsPie = ['Download Sales', 'Download Sales', 'In-Store Sales', 'Mail Sales'];
          $scope.labelsPie = $scope.categories;
          // $scope.dataPie = [300, 200, 500, 100];
          $scope.dataPie = $scope.categoryValues;

          $scope.labelsBar = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
          $scope.seriesBar = ['Series A', 'Series B'];

          $scope.dataBar = [
          [65, 59, 80, 81, 56, 55, 40],
          [28, 48, 40, 19, 86, 27, 90]
          ];
        };

        $scope.$back = function () {
          window.history.back();
        };

        vm.scope = $scope;

        CustomersService.query(function (results) {
          vm.customers = results;
        });

        var aggregatePieData = function(expenses) {
          expenses.map(function(expense, index) {
            if ($scope.categories.indexOf(expense.category) !== -1) {
              $scope.categoryValues[$scope.categories.indexOf(expense.category)] += expense.amount;
            } else {
              $scope.categories.push(expense.category);
              $scope.categoryValues.push(expense.amount);
            }

          });
        };

        ExpensesService.query(function (results) {
          vm.expenses = results;

          var now = new Date();

          var thisMonthExpenses = vm.expenses.filter(function(expense) {
            if (new Date(expense.expenseDate).getMonth() === now.getMonth())
              return expense;
          });

          aggregatePieData(thisMonthExpenses);
          refreshData();
        });

        vm.customer = customerResolve;

        vm.getExpensesForCustomer = expensesResolve.data;
      }]);
})();