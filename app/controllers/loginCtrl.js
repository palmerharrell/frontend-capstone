"use strict";

app.controller("LoginCtrl",
[
  "$scope",
  "$location",
  "$http",
  "authFactory",
  "firebaseURL",

  function ($scope, $location, $http, authFactory, firebaseURL) {

    let ref = new Firebase(firebaseURL);

    $scope.account = { email: "", password: "" };
    $scope.message = "";

    // // Unauthenticate user when /logout path used
    // if ($location.path() === "/logout") {
    //   ref.unauth();
    // }

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
