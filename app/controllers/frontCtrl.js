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
              // console.log("Item: ", JSONobjFromGet[key].name, "Finished: ", JSONobjFromGet[key].finished);
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

    $scope.filterButtonClasses = function(e) {
      var clickedButtonId = `#${e.target.id}`;
      // remove .active-filter from all .filter-button
      var filterButtons = $(".filter-button");
      for (var i = 0; i < filterButtons.length; i++) {
        var currentButton = filterButtons[i];
        $(currentButton).removeClass("active-filter");
      }
      // add .active-filter to clicked button
      $(clickedButtonId).addClass("active-filter");
    };

    $scope.backlogButtonClasses = function(e) {
      var clickedButtonId = `#${e.target.id}`;
      // console.log("clickedButtonId", clickedButtonId);
      // remove .active-filter from other button
      if (clickedButtonId === "#backlog-button") {
        $("#finished-button").removeClass("active-filter");
        $("#finished-button").addClass("hand");
      } else {
        $("#backlog-button").removeClass("active-filter");
        $("#backlog-button").addClass("hand");
      }
      // add .active-filter to clicked button
      $(clickedButtonId).addClass("active-filter");
      $(clickedButtonId).removeClass("hand");
    };

    $scope.changeTheme = function(e) {
      var clickedButtonId = `#${e.target.id}`;
      if (clickedButtonId === "#bw-button") {
        $("#color-button").removeClass("active-filter");
        $("#color-button").addClass("hand");
        $("#front-container").removeClass("color-theme");
        $("#front-container").addClass("gray-theme");
      } else {
        $("#bw-button").removeClass("active-filter");
        $("#bw-button").addClass("hand");
        $("#front-container").removeClass("gray-theme");
        $("#front-container").addClass("color-theme");
      }
      // add .active-filter to clicked button
      $(clickedButtonId).addClass("active-filter");
      $(clickedButtonId).removeClass("hand");

    };

    $scope.applyClass = function(item) {
      if (item.type === "Book") {
        return "book-item";
      } else if (item.type === "Movie") {
        return "movie-item";
      } else if (item.type === "TV Show") {
        return "show-item";
      } else if (item.type === "Music") {
        return "music-item";
      } else if (item.type === "Game") {
        return "game-item";
      } else {
        return "";
      }
    };


    $scope.loadFromFirebase(); // Get list on page load
    $("#name-input").focus(); // Set focus to new item inputs
    $("#logout-link").show(); // Show logout link

  }
]);


