(function() {

  var SERVER_URL = 'http://104.131.78.132:5000/';
  var username = 'u1';

  //angular
  var MainCtrl = function($scope, $http) {
    //If we are a stb, set the resolution
    if (!!navigator.setResolution) {
      navigator.setResolution(1280, 720);
    }

    //Disable websecutiry to bypass CORS issues if any.
    if (!!navigator.setWebSecurityEnabled){
      navigator.setWebSecurityEnabled(false);
    }

    this.http = $http;
    var self = this;
    this.http({
      method: 'GET',
      url: SERVER_URL + 'api/isCaredBy/' + username + '/'
    })
    .success(function(data, status, headers, config) {
      self.carers = carers.users;
    });
  };

  MainCtrl.prototype.whatever = function() {
  };

  angular.module('livesaver', [])
  .controller('main', ['$scope', '$http', MainCtrl]);
})();
