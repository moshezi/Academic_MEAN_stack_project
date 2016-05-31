'use strict';

angular
  .module('expenses')
  .controller('ExpensesListController',
    ['ExpensesService', 'Authentication', '$http', '$timeout',
      function (ExpensesService, Authentication, $http, $timeout) {
        var vm = this;

        vm.expenses = ExpensesService.query();

        vm.currentCustomerExpenses = [];


        if (Authentication.user) {
          $http.get('/api/user-expenses/' + Authentication.user._id).then(function (results) {
            $timeout(function () {vm.currentCustomerExpenses = results.data;});
          });
        }
      }]);
