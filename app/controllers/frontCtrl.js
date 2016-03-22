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
      $scope.newItem.date = new Date().toLocaleDateString(); // Set date added

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
           // Clear input boxes on submit
          $scope.newItem.name = null;
          $scope.newItem.type = null;
          $scope.newItem.recommended = null;
          $scope.newItem.notes = null;
          // Set focus to Name input to easily add another item
          $("#name-field").focus();

        },
        function(response) {  // Handle REJECT
          console.log("POST Rejected:", response);
        }
      );
    };

    $scope.cancelAdd = function() {
      // Clear input boxes and set focus back to Name
      $scope.newItem.name = null;
      $scope.newItem.type = null;
      $scope.newItem.recommended = null;
      $scope.newItem.notes = null;
      $("#name-field").focus();
    };

    $scope.deleteItem = function() {

      $http.delete(firebaseURL + '/items/' + this.item.id +'.json')
      .then(
        function() { // Handle RESOLVE
          $scope.loadFromFirebase(); // Reload Firebase db
        },
        function() { // Handle REJECT
          console.log("DELETE rejected.", response);
        }
      );
    };

    $scope.loadFromFirebase(); // Get list on page load
    $("#name-field").focus(); // Set focus to new item inputs

  }

]);








