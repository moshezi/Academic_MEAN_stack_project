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

  // Make sure the Socket is connected
  if (!Socket.socket) {
    Socket.connect();
  }

  // Add an event listener to the 'chatMessage' event
  Socket.on('chatMessage', function (message) {
    $scope.messages.unshift(message);
  });

  $http.get('/chat/allmessages').
  success(function(data, status, headers, config) {
    data.map(function(value) {
      $scope.messages.unshift(value);
    });
  }).
  error(function(data, status, headers, config) {
    // log error
  });

  // Create a controller method for sending messages
  $scope.sendMessage = function () {
    // Create a new message object
    var message = {
      text: this.messageText
    };

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
