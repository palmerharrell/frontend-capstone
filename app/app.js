
var app = angular.module("EBMapp", ["ngRoute", "firebase"]);

// Address of Firebase database
app.constant('firebaseURL', "https://angularpracticeph.firebaseio.commmmm");

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

// Set up angular-route:
app.config(["$routeProvider",
  function ($routeProvider) {
    $routeProvider.
      when("/", {
        templateUrl: "partials/front-page.html",
        controller: "frontCtrl"
      }).
      when("/page2", {
        templateUrl: "partials/page-2.html",
        controller: "page2Ctrl"
      }).
      when("/page3", {
        templateUrl: "partials/page-3.html",
        controller: "page3Ctrl"
      }).
      when("/page4", {
        templateUrl: "partials/page-4.html",
        controller: "page4Ctrl"
      }).
      otherwise({
        redirectTo: "/"
      });
  }]);

