(function () {
  'use strict';

  angular
  .module('expenses')
  .controller('AdvisorsController', ['$scope', 'ExpensesService', 'Users', 'Authentication',
  function ($scope, ExpensesService, Users, Authentication) {

    $scope.advisor = Authentication.user.advisor;
    $scope.users = Users.query();
    var fixAdvisors = function () {
      $scope.users.map(function(user) {
        if (user._id === Authentication.user._id) {
          $scope.advisor = Authentication.user.advisor;
          return;
        }
      });
    };

    $scope.chooseAdvisor = function(user) {
      var newUser = new Users(Authentication.user);
      newUser.advisor=user;
      newUser.$update(function (response) {

        Authentication.user = response;
        $scope.advisor = Authentication.user.advisor;
        fixAdvisors();
      }, function (response) {
      });
    };

    fixAdvisors();

    $scope.isUserAdvisor = function(user) {
      return (user.roles.indexOf('advisor') !== -1);
    };
  }]);
})();
