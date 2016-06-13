'use strict';

// Create the 'chat' controller
angular.module('chat').controller('ChatController', ['$scope', '$location', 'Authentication', 'Socket', '$http',
function ($scope, $location, Authentication, Socket, $http) {
  // Create a messages array
  $scope.messages = [];

  // If user is not signed in then redirect back home
  if (!Authentication.user) {
    $location.path('/');
  }

  $scope.user = Authentication.user;
  $scope.isAdvisor = $scope.user.roles.indexOf('advisor') !== -1;

  // Make sure the Socket is connected
  if (!Socket.socket) {
    Socket.connect();
  }

  $scope.chooseCustomer = function (customer) {
    $scope.chosenCustomer = customer;
    $scope.messages = [];
    getAllMessages();
  }

  function getAllCustomers() {
    $http.get('/api/customers')
    .success(function (data, status, headers, config) {
      $scope.customers = data;
    })
    .error(function (data, status, headers, config) {
      
    })
  }
  if ($scope.isAdvisor) {
    getAllCustomers();
  }

  // Add an event listener to the 'chatMessage' event
  Socket.on('chatMessage', function (message) {
    if (checkIfMessageRelevant(message))
      $scope.messages.unshift(message);
  });

  function getAllMessages() {
    $http.get('/chat/allmessages').
    success(function(data, status, headers, config) {
      data.map(function(value) {
        if (checkIfMessageRelevant(value)) {
          $scope.messages.unshift(value);
        } 
      });
    }).
    error(function(data, status, headers, config) {
      // log error
    });
  }

  getAllMessages();

  function checkIfMessageRelevant(message) {
    if ($scope.isAdvisor && !$scope.chosenCustomer || !$scope.isAdvisor && !$scope.user.advisor)
      return false;
      
    if (message.type === 'status') {
      if ($scope.isAdvisor) {
        // I am an advisor
        if (!!$scope.customers && $scope.customers.length > 0) {
          return $scope.customers.some(function(customer) {
            return (customer._id === message.sender._id);
          });
        } 
        return false;
      } else {
        // I am a customer
        return (!!$scope.user.advisor && $scope.user.advisor._id === message.sender._id);
      }

    } else if (message.type === 'message') {

      if (!message.to)
        return false;

      var myId = $scope.user._id;
      var receiverId = ($scope.isAdvisor ? $scope.chosenCustomer._id : $scope.user.advisor._id);

      return ((message.sender._id === myId && message.to._id === receiverId) ||
          (message.sender._id === receiverId && message.to._id === myId))
    }
  }

  // Create a controller method for sending messages
  $scope.sendMessage = function () {
    // Create a new message object
    var message = {
      text: this.messageText
    };

    if ($scope.isAdvisor) {
      if (!$scope.chosenCustomer)
        return;
      message.to = $scope.chosenCustomer;
    } else {
      if (!$scope.user.advisor) {
        return;
      }
      message.to = $scope.user.advisor;
    }

    // Emit a 'chatMessage' message event
    Socket.emit('chatMessage', message);

    // Clear the message text
    this.messageText = '';
  };

  // Remove the event listener when the controller instance is destroyed
  $scope.$on('$destroy', function () {
    Socket.removeListener('chatMessage');
  });
}
]);
