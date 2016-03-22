app.controller("frontCtrl", [
  "$scope",
  "getFactory",
  
  function($scope, getFactory) {
    
    console.log("frontCtrl.js is running.");

    $scope.loadFromFirebase = function() {
      $scope.localCopy = [];
      getFactory().then(
          function(JSONobjFromGet) { // Handle RESOLVE
            for(var key in JSONobjFromGet) {
              JSONobjFromGet[key].id = key;
              $scope.localCopy.push(JSONobjFromGet[key]);
            }
          },
          function() { // Handle REJECT
            console.log("Rejected");
          }
      );
    };

    $scope.loadFromFirebase();

  }

]);

