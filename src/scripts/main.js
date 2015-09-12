(function() {
  //If we are a stb, set the resolution
  if (!!navigator.setResolution) {
    navigator.setResolution(1280, 720);
  }

  //Disable websecutiry to bypass CORS issues if any.
  if (!!navigator.setWebSecurityEnabled){
    navigator.setWebSecurityEnabled(false);
  }

  var SERVER_URL = '104.131.78.132:5000';

  //angular
  angular.module('livesaver', [])

  .controller('main', ['$scope', function($scope) {
  }])

  .service('carers', [function() {
  }]);
})();
