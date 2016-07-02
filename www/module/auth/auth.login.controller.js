(function() {
    'use strict';

    angular
        .module('cofasa.auth')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$scope', '$state', '$rootScope', '$ionicLoading', '$ionicPopup', '$cordovaFacebook'];

    function LoginController($scope, $state, $rootScope, $ionicLoading, $ionicPopup, $cordovaFacebook) {

        $scope.auth = {
            email: 'boris0901@mail.com',
            password: '123456'
        }

        $scope.showError = function() {
            var errorPopup = $ionicPopup.alert({
                title: '',
                template: 'There was a problem with the login, please try again'
            });

            errorPopup.then(function(res) {
                console.log(res);
            });
        }

        $scope.doLogin = function() {

            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles" class="spinner-balanced">'
            });

            Parse.User.logIn($scope.auth.email, $scope.auth.password, {
                success: function(user) {
                    $ionicLoading.hide();
                    $rootScope.sessionUser = user;
                    $state.go("home.map");
                },
                error: function(user, error) {
                    $ionicLoading.hide();
                    $scope.showError();
                }
            });
        }

        $scope.doFacebookLogin = function() {

            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles" class="spinner-balanced">'
            });

            $cordovaFacebook.login(["public_profile", "email"]).then(
                function(success) {
                    // Need to convert expiresIn format from FB to date
                    var expiration_date = new Date();
                    expiration_date.setSeconds(expiration_date.getSeconds() + success.authResponse.expiresIn);
                    expiration_date = expiration_date.toISOString();

                    var facebookAuthData = {
                        "id": success.authResponse.userID,
                        "access_token": success.authResponse.accessToken,
                        "expiration_date": expiration_date
                    };

                    Parse.FacebookUtils.logIn(facebookAuthData, {
                        success: function(user) {
                            console.log(user);

                            if (!user.existed()) {
                                console.log('User signed up and logged in through Facebook!');
                            }
                            else {
                                console.log('User logged in through Facebook');
                            }

                            $ionicLoading.hide();
                            $rootScope.sessionUser = user;
                            $state.go("home.map");
                        },
                        error: function(user, error) {
                            $ionicLoading.hide();
                            $scope.showError();
                        }
                    });
                },
                function(error) {
                    console.log(error);
                }
            );
        }
    }
})();