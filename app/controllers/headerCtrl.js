
app.controller("headerCtrl",
[
  "$scope",
  "$location",
  "firebaseURL",
  "authFactory",

  function ($scope, $location, firebaseURL, authFactory) {
  	console.log("headerCtrl is running");

  	// $scope.showLogout = false;

  	// console.log("authenticated?", authFactory.isAuthenticated());

  	// if (authFactory.isAuthenticated()) {
  	// 	$scope.showLogout = true;
  	// } else {
  	// 	$scope.showLogout = false;
  	// };

  	// $scope.toggleLogoutLink = function() {
  	// 	if ($scope.showLogout) {
  	// 		$scope.showLogout = false;
  	// 	} else {
  	// 		$scope.showLogout = true;
  	// 	};
  	// }

    // var ref = new Firebase(firebaseURL);



    // Unauthenticate user when /logout path used
    // if ($location.path() === "/#/logout") {
    // 	console.log("path changed to /logout");
    //   ref.unauth();
    // }

  }
]);
