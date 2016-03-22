
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

// Set up angular-route:
app.config(["$routeProvider",
  function ($routeProvider) {
    $routeProvider.
      when("/", {
        templateUrl: "partials/front-page.html",
        controller: "frontCtrl"
      }).
      otherwise({
        redirectTo: "/"
      });
  }]);

