(function () {
  'use strict';

  angular
    .module('customers')
    .controller('CustomersGraphController',
    ['$scope', 'CustomersService', 'ExpensesService', '$http', '$timeout', 'customerResolve', 'expensesResolve',
      function ($scope, CustomersService, ExpensesService, $http, $timeout, customerResolve, expensesResolve) {
        var vm = this;

        // this month        
        $scope.thisMonthCategories = [];
        $scope.thisMonthCategoryValues = [];
        $scope.thisMonthBarData = [0,0,0,0];

        // last month
        $scope.lastMonthCategories = [];
        $scope.lastMonthCategoryValues = [];
        $scope.lastMonthBarData = [0,0,0,0];

        // this year
        $scope.thisYearBarData = [0,0,0,0,0,0,0,0,0,0,0,0];

        var refreshData = function() {
          $scope.monthLabelsBar = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
          $scope.monthSeriesBar = ['Expenses'];

          // this month
          $scope.thisMonthLabelsPie = $scope.thisMonthCategories;
          $scope.thisMonthDataPie = $scope.thisMonthCategoryValues;
          $scope.thisMonthDataBar = [];
          $scope.thisMonthDataBar[0] = $scope.thisMonthBarData;

          // last month
          $scope.lastMonthLabelsPie = $scope.lastMonthCategories;
          $scope.lastMonthDataPie = $scope.lastMonthCategoryValues;
          $scope.lastMonthDataBar = [];
          $scope.lastMonthDataBar[0] = $scope.lastMonthBarData;
          // [65, 59, 80, 81]
          // ];

          $scope.thisYearLabelsBar = ['January', 'February', 'March', 'April', 'May',
                                       'June', 'July', 'August', 'September', 'October',
                                      'November', 'December'];
          $scope.thisYearSeriesBar = ['Expenses'];

          $scope.thisYearDataBar = [];
          $scope.thisYearDataBar[0] = $scope.thisYearBarData;
        };

        $scope.$back = function () {
          window.history.back();
        };

        vm.scope = $scope;

        CustomersService.query(function (results) {
          vm.customers = results;
        });

        // This Month

        var aggregateThisMonthPieData = function(expenses) {
          expenses.map(function(expense, index) {
            if ($scope.thisMonthCategories.indexOf(expense.category) !== -1) {
              $scope.thisMonthCategoryValues[$scope.thisMonthCategories.indexOf(expense.category)] += expense.amount;
            } else {
              $scope.thisMonthCategories.push(expense.category);
              $scope.thisMonthCategoryValues.push(expense.amount);
            }

          });
        };

        var aggregateThisMonthBarData = function(expenses) {
          expenses.map(function(expense) {
            var expenseDate = new Date(expense.expenseDate);
            var weekNumbar = 0 | expenseDate.getDate() / 7;
            if (weekNumbar > 3)
              weekNumbar = 3;
            $scope.thisMonthBarData[weekNumbar] += expense.amount;
          });
        };

        // Last Month

        var aggregateLastMonthPieData = function(expenses) {
          expenses.map(function(expense, index) {
            if ($scope.lastMonthCategories.indexOf(expense.category) !== -1) {
              $scope.lastMonthCategoryValues[$scope.lastMonthCategories.indexOf(expense.category)] += expense.amount;
            } else {
              $scope.lastMonthCategories.push(expense.category);
              $scope.lastMonthCategoryValues.push(expense.amount);
            }

          });
        };

        var aggregateLastMonthBarData = function(expenses) {
          expenses.map(function(expense) {
            var expenseDate = new Date(expense.expenseDate);
            var weekNumbar = 0 | expenseDate.getDate() / 7;
            if (weekNumbar > 3)
              weekNumbar = 3;
            $scope.lastMonthBarData[weekNumbar] += expense.amount;
          });
        };

        // This year

        var aggregatethisYearBarData = function(expenses) {
          expenses.map(function(expense) {
            var expenseDate = new Date(expense.expenseDate);
            $scope.thisYearBarData[expenseDate.getMonth()] += expense.amount;
          });
        };

        ExpensesService.query(function (results) {
          vm.expenses = results;

          var now = new Date();

          var thisMonthExpenses = vm.expenses.filter(function(expense) {
            if (new Date(expense.expenseDate).getMonth() === now.getMonth())
              return expense;
          });

          var lastMonthExpenses = vm.expenses.filter(function(expense) {
            if (new Date(expense.expenseDate).getMonth() === now.getMonth() - 1)
              return expense;
          });
          var thisYearExpenses = vm.expenses.filter(function(expense) {
            if (new Date(expense.expenseDate).getYear() === now.getYear())
              return expense;
          });

          aggregateThisMonthPieData(thisMonthExpenses);
          aggregateThisMonthBarData(thisMonthExpenses);

          aggregateLastMonthPieData(lastMonthExpenses);
          aggregateLastMonthBarData(lastMonthExpenses);
          aggregatethisYearBarData(thisYearExpenses);

          refreshData();
        });

        vm.customer = customerResolve;

        vm.getExpensesForCustomer = expensesResolve.data;
      }]);
})();