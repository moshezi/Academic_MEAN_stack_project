(function () {
  'use strict';

  // Expenses controller
  angular
    .module('expenses')
    .controller('ExpensesController', ExpensesController);

  ExpensesController.$inject = ['$scope', '$state', 'Authentication', 'expenseResolve'];

  function ExpensesController ($scope, $state, Authentication, expense) {
    var vm = this;

    var moment = window.moment;
    vm.authentication = Authentication;
    vm.expense = expense;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Expense
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.expense.$remove($state.go('expenses.list'));
      }
    }

    // Save Expense
    function save(isValid) {
      if (vm.tempExpenseDate) {
        try {
          var date = moment(vm.tempExpenseDate, 'DD/MM/YYYY');
          vm.expense.expenseDate = date.toDate().getTime();
        } catch (err) {

        }
      }
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.expenseForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.expense._id) {
        vm.expense.$update(successCallback, errorCallback);
      } else {
        vm.expense.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('expenses.view', {
          expenseId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
