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

// focus on show directive
app.directive('focusOnShow', function($timeout) {
    return {
        restrict: 'A',
        link: function($scope, $element, $attr) {
            if ($attr.ngShow){
                $scope.$watch($attr.ngShow, function(newValue){
                    if(newValue){
                        $timeout(function(){
                            $element.focus();
                        }, 0);
                    }
                })      
            }
            if ($attr.ngHide){
                $scope.$watch($attr.ngHide, function(newValue){
                    if(!newValue){
                        $timeout(function(){
                            $element.focus();
                        }, 0);
                    }
                })      
            }

        }
    };
});

// Select input text when input gains focus
app.directive('selectOnFocus', ['$window', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('focus', function () {
                if (!$window.getSelection().toString()) {
                    // Required for mobile Safari
                    this.setSelectionRange(0, this.value.length)
                }
            });
        }
    };
}]);

// check if user is authenticated
var isAuth = (authFactory) => new Promise((resolve, reject) => {
  if (authFactory.isAuthenticated()) {
    console.log("User is authenticated, resolve route promise");
    resolve();
  } else {
    console.log("User is not authenticated, reject route promise");
    reject();
  }
});

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
      when("/logout", {
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




