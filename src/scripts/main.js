//If we are a stb, set the resolution
if (!!navigator.setResolution) {
  navigator.setResolution(1280, 720);
}

//Disable websecutiry to bypass CORS issues if any.
if (!!navigator.setWebSecurityEnabled){
  navigator.setWebSecurityEnabled(false);
}

var carersRef = new Firebase("https://tvhack.firebaseio.com/users-carer");

carersRef.once('value', function(snapshot) {
  console.log(snapshot, snapshot.val());
});


angular.module('livesaver', [])

.controller('main', function($scope) {
  $scope.test = 20;
})
