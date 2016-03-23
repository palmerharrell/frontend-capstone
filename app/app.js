"use strict";

var app = angular.module("EBM-App", ["ngRoute", "firebase"]);

// Address of Firebase database
app.constant('firebaseURL', "https://entertainmentbacklog.firebaseio.com");

// ng-enter directive
app.directive('ngEnter', function () {
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      if(event.which === 13) {
        scope.$apply(function (){
          scope.$eval(attrs.ngEnter);
        });
				event.preventDefault();
      }
    });
  };
});

// ng-esc directive
app.directive('ngEsc', function () {
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      if(event.which === 27) {
        scope.$apply(function (){
          scope.$eval(attrs.ngEsc);
        });
        event.preventDefault();
      }
    });
  };
});

var isAuth = (authFactory) => new Promise((resolve, reject) => {
  if (authFactory.isAuthenticated()) {
    console.log("User is authenticated, resolve route promise");
    resolve();
  } else {
    console.log("User is not authenticated, reject route promise");
    reject();
  }
});

// var isAuth = function(authFactory) {
//   new Promise(resolve, reject) {
//     if (authFactory.isAuthenticated()) {
//       console.log("User is authenticated, resolve route promise");
//       resolve();
//     } else {
//       console.log("User is not authenticated, reject route promise");
//       reject();
//     }
//   }
// };

// Set up angular-route
app.config(["$routeProvider",
  function ($routeProvider) {
    $routeProvider.
      when("/", {
        templateUrl: "partials/front-page.html",
        controller: "frontCtrl",
        resolve: { isAuth }
      }).
      when("/login", {
        templateUrl: "partials/login.html",
        controller: "LoginCtrl"
      }).
      otherwise({
        redirectTo: "/"
      });
  }]);

// redirect to login if user is not authenticated
app.run([
  "$location",
  "firebaseURL",

  function ($location, firebaseURL) {
    var ref = new Firebase(firebaseURL);

    ref.onAuth(function(authData) {
      if (!authData) {
        $location.path("/login");
      }
    });
  }
]);




