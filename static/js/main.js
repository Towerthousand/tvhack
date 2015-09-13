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

  var videoHTML = [
    '<video',
    'src="http://104.131.78.132:80/static/test.m3u8"',
    'height="400" width="700"',
    'id="vid" autoplay="true"',
    'onabort="console.log(\' ABORT \')"',
    'oncanplay="console.log(\' CAN PLAY \')"',
    'oncanplaythrough="console.log(\' CAN PLAY THROUGH\' )"',
    'oncuechange="console.log(\' CUE CHANGE \')"',
    'ondurationchange="console.log(\' DURATION CHANGE \')"',
    'onemptied="console.log(\' EMPTIED \')"',
    'onended="console.log( \'ENDED\' )"',
    'onerror="console.log(\' ERROR\' )"',
    'onloadeddata="console.log(\' LOADED DATA \')"',
    'onloadedmetadata="console.log(\' LOADED METADATA \')"',
    'onloadstart="console.log(\' LOAD START \')"',
    'onpause="console.log(\' PAUSE \')"',
    'onplay="console.log(\' PLAY \')"',
    'onplaying="console.log(\' PLAYING \')"',
    'onprogress="console.log(\' PROGRESS \')"',
    'onratechange="console.log(\' RATE CHANGE \')"',
    'onseeked="console.log(\' SEEKED \')"',
    'onseeking="console.log(\' SEEKING \')"',
    'onstalled="console.log(\' STALLED \')"',
    'onsuspend="console.log(\' SUSPEND \')"',
    'onvolumechange="console.log(\' VOLUME CHANGE \')"',
    'onwaiting="console.log(\' WAITING \')">',
    '</video>'
  ].join(' ');

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
    var self = mainSelf = this;

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
    this.state = 'dialing';
    console.log(this.state);

    setTimeout(function() {
      if (mainSelf.state == 'dialing') {
        console.log('Cancelling call');
        return mainSelf.state = '';
      }
      else angular.element(document.getElementById('hotbod')).append(videoHTML);
    }, 5000);
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

    if (code == keyEnum.enter) {
      mainSelf.startCall();

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

    if (code == 49 && mainSelf.state == 'dialing') {
      mainSelf.state = 'connecting';
    }

    if (code == 50 && mainSelf.state == 'dialing') {
      mainSelf.state = '';
    }

    mainSelf.scope.$apply();
  };

  MainCtrl.prototype.pingOnline = function() {
    // this.http({
    //   method: 'GET',
    //   url: SERVER_URL + 'stayOnline/' + username + ''
    // });
  };

  var CallCtrl = function() {
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
