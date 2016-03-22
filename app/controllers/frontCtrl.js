app.controller("frontCtrl", [
  "$scope",
  "$http",
  "firebaseURL",
  "getFactory",
  
  function($scope, $http, firebaseURL, getFactory) {
    
    console.log("frontCtrl.js is running.");

    $scope.newItem = {
      id: "", 
      fbuid: "", 
      name: "", 
      type: "", 
      finished: false, 
      recommended: "",
      notes: "",
      rating: 0,
      date: ""
    };

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

    $scope.addNewItem = function() {
      console.log("newItem: ", $scope.newItem);

      $http.post(firebaseURL + '/items.json',

        JSON.stringify({
          id: $scope.newItem.id,
          fbuid: $scope.newItem.fbuid,
          name: $scope.newItem.name,
          type: $scope.newItem.type,
          finished: $scope.newItem.finished,
          recommended: $scope.newItem.recommended,
          notes: $scope.newItem.notes,
          rating: $scope.newItem.rating,
          date: $scope.newItem.date

        }))
      .then(
        function() {  // Handle RESOLVE
          $scope.loadFromFirebase(); // Reload Firebase db
        },
        function(response) {  // Handle REJECT
          console.log("POST Rejected:", response);
        }
      );
    };

    $scope.loadFromFirebase(); // Get list on page load

  }

]);

