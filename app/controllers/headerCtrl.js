
app.controller("headerCtrl",
[
  "$location",
  "firebaseURL",

  function ($location, firebaseURL) {

    var ref = new Firebase(firebaseURL);

    // Unauthenticate user when /logout path used
    if ($location.path() === "/logout") {
      ref.unauth();
    }

  }
]);
