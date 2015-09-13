function init() {
  var FRONTEND_URL = 'http://104.131.78.132:80/'
  var SERVER_URL = FRONTEND_URL + 'api/';
  var TV_URL = 'http://35.2.78.140:8080/';
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
          if (self.state = 'connecting' || self.state == 'dialing') return;
          self.startCall();
        };
      }
    });
  };

  MainCtrl.prototype.startCall = function() {
    this.state = 'dialing';
    console.log(this.state);

    setTimeout(function() {
      if (mainSelf.state == 'dialing' || mainSelf.state == '') {
        console.log('Cancelling call');
        return mainSelf.state = '';
      } else {
        mainSelf.http({
          method: 'GET',
          url: TV_URL + 'itv/startURL?url=' + FRONTEND_URL + 'call'
        })
      }
    }, 15000);
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

    if (code == 55) {
      mainSelf.state = 'messages';
    }

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

    if (code == 49 && mainSelf.state == 'messages') {
      mainSelf.http({
        method: 'GET',
        url: TV_URL + 'itv/startURL?url=' + FRONTEND_URL + 'message'
      })
    }

    if (code == 49 && mainSelf.state == 'dialing') {
      mainSelf.state = 'connecting';
    }

    if (code == 50 && mainSelf.state == 'dialing') {
      mainSelf.state = '';
    }

    if (code == 56) {
      mainSelf.state = 'dialing';
      mainSelf.startCall()
    }

    mainSelf.scope.$apply();
  };

  MainCtrl.prototype.pingOnline = function() {
    // this.http({
    //   method: 'GET',
    //   url: SERVER_URL + 'stayOnline/' + username + ''
    // });
  };

  var callSelf;
  var CallCtrl = function($scope, $http) {
    callSelf = this;
    this.http = $http;

    window.onkeydown = this.handleControlKey
  };

  CallCtrl.prototype.handleControlKey = function(e) {
    var code = e.keyCode;

    if (code == 49) {
      callSelf.http({
        method: 'GET',
        url: TV_URL + 'itv/startURL?url=' + FRONTEND_URL
      })
      .success(function() {
        mainSelf.http({
          method: 'GET',
          url: TV_URL + 'drv/play?uniqueId=84&playFrom=offset&offset=250'
        });
      });
    }
  };

  var messageSelf;
  var MessageCtrl = function($scope, $http) {
    messageSelf = this;
    this.http = $http;

    window.onkeydown = this.handleControlKey
  };

  MessageCtrl.prototype.handleControlKey = function(e) {
    var code = e.keyCode;

    if (code == 49) {
      callSelf.http({
        method: 'GET',
        url: TV_URL + 'itv/startURL?url=' + FRONTEND_URL
      })
      .success(function() {
        mainSelf.http({
          method: 'GET',
          url: TV_URL + 'drv/play?uniqueId=84&playFrom=offset&offset=250'
        });
      });
    }
  };

  var Config = function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
  };

  angular.module('livesaver', [])
  .config(['$interpolateProvider', Config])
  .controller('main', ['$scope', '$http', MainCtrl])
  .controller('call', ['$scope', '$http', CallCtrl])
  .controller('message', ['$scope', '$http', MessageCtrl]);

  angular.bootstrap(document.body, ['livesaver']);
};
