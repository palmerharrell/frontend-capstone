
app.controller("headerCtrl",
[
  "$location",
  "firebaseURL",

  function ($location, firebaseURL) {
  	console.log("headerCtrl is running");
    var ref = new Firebase(firebaseURL);

    // Unauthenticate user when /logout path used
    if ($location.path() === "/#/logout") {
    	console.log("path changed to /logout");
      ref.unauth();
    }

  }
]);
