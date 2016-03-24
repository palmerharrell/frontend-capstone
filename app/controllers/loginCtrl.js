"use strict";

app.controller("LoginCtrl",
[
  "$scope",
  "$location",
  "$http",
  "authFactory",
  "firebaseURL",

  function ($scope, $location, $http, authFactory, firebaseURL) {
    
    $("#logout-link").hide(); // Hide logout link
    $("#email-input").focus(); // Set focus to email input

    let ref = new Firebase(firebaseURL);
    ref.unauth(); // If a user is logged in, log them out

    $scope.account = { email: "", password: "" };
    // $scope.message = "";

    // register a new user account and login  
    $scope.register = () => {
      ref.createUser({
        email    : $scope.account.email,
        password : $scope.account.password
      }, (error, userData) => {
        if (error) {
          console.log(`Error creating user: ${error}`);
        } else {
          console.log(`Created user account with uid: ${userData.uid}`);
          $scope.login();
        }
      });
    };

    // authenticate user
    $scope.login = () => 
      authFactory
        .authenticate($scope.account)
        .then(() => {
          $location.path("/");
          $scope.$apply();  // Needed for $location.path() to succeed
        });


  }
]);
