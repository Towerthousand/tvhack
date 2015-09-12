(function() {
  //If we are a stb, set the resolution
  if (!!navigator.setResolution) {
    navigator.setResolution(1280, 720);
  }

  //Disable websecutiry to bypass CORS issues if any.
  if (!!navigator.setWebSecurityEnabled){
    navigator.setWebSecurityEnabled(false);
  }


  var tvUser = 'u1';
  var carerUsersRef = new Firebase('http://tvhack.firebaseio.com/users-carer');
  var tvUserRef = new Firebase('http://tvhack.firebaseio.com/users-tv/' + tvUser);

  carerUsersRef.once('value', function(snap) {
  });


  angular.module('livesaver', [])

  .controller('main', function($scope) {
    $scope.carers = [];

    tvUserRef.once('value', function(tvUserData) {
      // console.log(tvUserData.val());
      $scope.user = tvUserData.val();

      carerUsersRef.once('value', function(snap) {
        var users = snap.val();
        console.log(users);

        for (var key in users) {
          var user = users[key];
          if (!~user.caresFor.indexOf(tvUser)) return;
          $scope.carers.push(user);
        }
      });
    });
  })
})();
