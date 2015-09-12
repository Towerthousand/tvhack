(function() {

  var SERVER_URL = 'http://104.131.78.132:5000/api/';
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
    this.carers = [];
    var self = this;
    this.stayAlive = setInterval(function() {
      self.pingOnline();
    }, 5000);
  };

  MainCtrl.prototype.pingOnline = function() {
    var self = this;
    this.http({
      method: 'GET',
      url: SERVER_URL + 'isCaredBy/' + username + '/'
    })
    .success(function(data, status, headers, config) {
      self.carers = carers.users;
    });
  };

  MainCtrl.prototype.pingOnline = function() {
    this.http({
      method: 'GET',
      url: SERVER_URL + 'stayOnline/' + this.username + '/'
    });
  };

  MainCtrl.prototype.whatever = function() {
  };

  var Config = function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
  }

  angular.module('livesaver', [])
  .config(['$interpolateProvider', Config])
  .controller('main', ['$scope', '$http', MainCtrl]);
})();
