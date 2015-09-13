function init() {
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

  document.body.className = '';

  //angular
  var mainSelf;
  var MainCtrl = function($scope, $http) {
    //If we are a stb, set the resolution
    if (!!navigator.setResolution) {
      navigator.setResolution(1280, 720);
    }

    //Disable websecutiry to bypass CORS issues if any.
    if (!!navigator.setWebSecurityEnabled){
      navigator.setWebSecurityEnabled(false);
    }

    window.onkeydown = this.handleControlKey;
    window.test = this;

    this.accordion = {
      index: 0
    };

    this.scope = $scope;
    this.state = '';
    this.http = $http;
    this.carers = [];
    this.inCall = false;
    var self = this;

    this.stayAlive = setInterval(function() {
      self.populateCarers();
      self.pingOnline();
      self.populateCalling();
    }, 1000);

    self.populateCarers();
    self.pingOnline();
    self.populateCalling();
  };

  MainCtrl.prototype.populateCalling = function() {
    var self = this;
    this.http({
      method: 'GET',
      url: SERVER_URL + 'isCalling/' + username + '/'
    })
    .success(function(data, status, headers, config) {
      if(data.isCalling) {
        if(!self.inCall) {
          self.http({
            method: 'GET',
            url: SERVER_URL + 'uncall/' + username + '/'
          });
          self.startCall();
        };
      }
    });
  };

  MainCtrl.prototype.startCall = function() {
    self.inCall = true;
  };

  MainCtrl.prototype.endCall = function() {
    self.inCall = false;
  };

  MainCtrl.prototype.populateCarers = function() {
    var self = this;
    this.http({
      method: 'GET',
      url: SERVER_URL + 'isCaredBy/' + username + '/'
    })
    .success(function(data, status, headers, config) {
      if (self.carers.length) {
        for (var i = 0; i < self.carers.length; i++) {
          self.carers[i].active = data.users[i].active;
        }
      } else {
        self.carers = data.users;
      }
    });
  };

  MainCtrl.prototype.handleControlKey = function(e) {
    var code = e.keyCode;
    console.log('bungy ' + code);

    if (code == keyEnum.enter) {
      if (mainSelf.state == 'accordion') {
        var userToCall = mainSelf.carers[mainSelf.accordion.index];
      }
    }

    if (code == 39) {
      mainSelf.accordion.index = (mainSelf.carers.length + mainSelf.accordion.index + 1) % mainSelf.carers.length;
    }

    if (code == 47) {
      mainSelf.accordion.index = (mainSelf.carers.length + mainSelf.accordion.index - 1) % mainSelf.carers.length;
      e.preventDefault();
    }

    if (code == 40) {
      mainSelf.state = mainSelf.state ? '' : 'accordion';
      e.preventDefault();
    }

    mainSelf.scope.$apply();
  };

  MainCtrl.prototype.pingOnline = function() {
    // this.http({
    //   method: 'GET',
    //   url: SERVER_URL + 'stayOnline/' + username + ''
    // });
  };

  var Config = function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
  };

  angular.module('livesaver', [])
  .config(['$interpolateProvider', Config])
  .controller('main', ['$scope', '$http', MainCtrl]);

  angular.bootstrap(document.body, ['livesaver']);
};
