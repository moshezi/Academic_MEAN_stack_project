;(function () {
  'use strict';

  angular
    .module('customers')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig ($stateProvider) {
    $stateProvider
      .state('customers', {
        abstract: true,
        url: '/customers',
        template: '<ui-view/>'
      })
      .state('customers.list', {
        url: '',
        templateUrl: 'modules/customers/client/views/list-customers.client.view.html',
        controller: 'CustomersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Customers List'
        }
      })
      .state('customers.month-category', {
        url: '/customers-month-category/:customerId/:month/:category',
        templateUrl: 'modules/customers/client/views/customer-month-category.client.view.html',
        controller: 'CustomersMonthCategoryController',
        controllerAs: 'vm',
        resolve: {
          customerResolve: getCustomer,
          expensesResolve: getCustomerMonthCategoryExpenses
        },
        data: {
          pageTitle: 'Customer {{ articleResolve.name }}'
        }
      })
      .state('customers.month-week', {
        url: '/customers-month-week/:customerId/:month/:week',
        templateUrl: 'modules/customers/client/views/customer-month-week.client.view.html',
        controller: 'CustomersMonthWeekController',
        controllerAs: 'vm',
        resolve: {
          customerResolve: getCustomer,
          expensesResolve: getCustomerMonthWeekExpenses
        },
        data: {
          pageTitle: 'Customer {{ articleResolve.name }}'
        }
      })
      .state('customers.graph', {
        url: '/:customerId',
        templateUrl: 'modules/customers/client/views/graph-customers.client.view.html',
        controller: 'CustomersGraphController',
        controllerAs: 'vm',
        resolve: {
          customerResolve: getCustomer,
          expensesResolve: getExpenses
        },
        data: {
          pageTitle: 'Customer {{ articleResolve.name }}'
        }
      })
      .state('customers.view', {
        url: '/:customerId',
        templateUrl: 'modules/customers/client/views/view-customer.client.view.html',
        controller: 'CustomersController',
        controllerAs: 'vm',
        resolve: {
          customerResolve: getCustomer
        },
        data: {
          pageTitle: 'Customer {{ articleResolve.name }}'
        }
      });
  }

  getExpenses.$inject = ['$stateParams', '$http'];
  getCustomerMonthCategoryExpenses.$inject = ['$stateParams', '$http'];
  getCustomerMonthWeekExpenses.$inject = ['$stateParams', '$http'];

  function getCustomer ($stateParams, CustomersService) {
    return CustomersService.get({
      customerId: $stateParams.customerId
    }).$promise;
  }

  function getCustomerMonthCategoryExpenses ($stateParams, $http) {
    var category = $stateParams.category;
    var month = $stateParams.month;
    var customerId = $stateParams.customerId;
    
    return $http.get('api/customer-month-category-expenses/' + customerId + '/' + month + '/' + category);
  }

  function getCustomerMonthWeekExpenses ($stateParams, $http) {
    var week = $stateParams.week;
    var month = $stateParams.month;
    var customerId = $stateParams.customerId;
    
    return $http.get('api/customer-month-week-expenses/' + customerId + '/' + month + '/' + week);
  }

  function getExpenses ($stateParams, $http) {
    var customerId = $stateParams.customerId;
    return $http.get('/api/user-expenses/' +customerId);
  }

  newCustomer.$inject = ['CustomersService'];

  function newCustomer (CustomersService) {
    return new CustomersService();
  }
})();
