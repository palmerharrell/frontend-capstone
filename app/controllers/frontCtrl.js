app.controller("frontCtrl", [
  "$scope",
  "$http",
  "firebaseURL",
  "$firebaseObject",
  "getFactory",
  "authFactory",
  
  function($scope, $http, firebaseURL, $firebaseObject, getFactory, authFactory) {
    
    console.log("frontCtrl.js is running.");

    var currentUser = authFactory.getUser();
    console.log("currentUser ID: ", currentUser.uid);

    var selectedFilters = {};
    
    // For editing properties of existing items
    $scope.editProp = {
      name: "",
      recommended: "",
      notes: ""
      // finished: false
    };

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
              console.log("Item: ", JSONobjFromGet[key].name, "Finished: ", JSONobjFromGet[key].finished);
              JSONobjFromGet[key].id = key;
              JSONobjFromGet[key].fbuid = currentUser.uid;
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
      // $scope.newItem.date = new Date().toLocaleDateString(); // Set date added
      $scope.newItem.date = new Date(); // Set date added
      $scope.newItem.fbuid = currentUser.uid; // Tie this item to current user

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
          $("#name-input").focus();

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
      $("#name-input").focus();
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

    // set value of input to current property value
    $scope.editMode = function(propName) {
      $scope.editProp[propName] = this.item[propName];
    };

    $scope.cancelEdit = function() {
      $scope.loadFromFirebase(); // Reload Firebase db
    };

    $scope.editProperty = function(propToChange, newVal) {
      var ref = new Firebase(firebaseURL + '/items/' + this.item.id);
      var obj = $firebaseObject(ref);
      obj.$loaded().then(function() {
        obj[propToChange] = newVal;
        obj.$save().then(function() {
          $scope.loadFromFirebase(); // Reload Firebase db
        },
        function() {
          console.log("Promise Rejected");
        });
      },
      function() {
        console.log("Promise Rejected");
      });
    };


    // TEST edit finished with checkbox
    // $scope.editFinished = function(propToChange, newVal) {
    //   console.log("propToChnage: ", propToChange);
    //   console.log("newVal: ", newVal);
    // };



    $scope.loadFromFirebase(); // Get list on page load
    $("#name-input").focus(); // Set focus to new item inputs
    $("#logout-link").show(); // Show logout link

  }

]);











