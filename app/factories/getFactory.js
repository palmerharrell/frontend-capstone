
app.factory("getFactory", function($q, $http, firebaseURL) {

  function getFromFirebase() {

    // Return a promise
    return $q(function(resolve, reject) {
      
      $http.get(firebaseURL + '/.json')
      .success(
        function(JSONobjFromGet) {
          resolve(JSONobjFromGet.items);
        },
        function(error) {
          reject(error);
        }
      );

    });
  }

  return getFromFirebase;

});
