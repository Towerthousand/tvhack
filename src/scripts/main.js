(function() {

  var SERVER_URL = 'http://104.131.78.132:80/api/';
  var username = 'u1';
  window.keyEnum = {
    enter: 13,
    rightArrow: 39,
    leftArrow: 37,
    1: 49,
    2: 50,
    3: 51,
    4: 52,
    5: 53,
    6: 54,
    7: 55,
    8: 56,
    9: 57
  };

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

    window.onkeydown = this.handleControlKey.bind(this);
    window.test = this;

    this.accordion = {
      index: 0
    };

    this.scope = $scope;
    this.state = '';
    this.http = $http;
    this.carers = [];
    var self = this;
    this.stayAlive = setInterval(function() {
      self.populateCarers();
      self.pingOnline();
    }, 3000);
  };

  MainCtrl.prototype.populateCarers = function() {
    var self = this;
    this.http({
      method: 'GET',
      url: SERVER_URL + 'isCaredBy/' + username + '/'
    })
    .success(function(data, status, headers, config) {
      console.log(data.users);
      self.carers = data.users;
    });
  };

  MainCtrl.prototype.handleControlKey = function(e) {
    var code = e.keyCode;

    if (code == keyEnum.enter) {
      if (!this.state) {
        this.state = 'accordion';
        this.scope.$apply();
      }

      // if (this.state = 'accordion') {
      //   this.state = 'calling';
      // }
    }

    if (code == 39) {
      this.accordion.index++;
    }
  }

  MainCtrl.prototype.pingOnline = function() {
    // this.http({
    //   method: 'GET',
    //   url: SERVER_URL + 'stayOnline/' + username + ''
    // });
  };

  var Config = function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
  }

  angular.module('livesaver', [])
  .config(['$interpolateProvider', Config])
  .controller('main', ['$scope', '$http', MainCtrl]);
})();
