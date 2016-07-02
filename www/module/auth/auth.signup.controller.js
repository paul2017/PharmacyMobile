(function() {
    'use strict';

    angular
        .module('cofasa.auth')
        .controller('SignupController', SignupController);

    SignupController.$inject = ['$scope', '$state', '$rootScope', '$ionicLoading', '$ionicPopup', '$cordovaFacebook'];

    function SignupController($scope, $state, $rootScope, $ionicLoading, $ionicPopup, $cordovaFacebook) {

        $scope.auth = {
            name: '',
            lastname: '',
            phone: '',
            email: '',
            password: '',
            role: 4,
            active: true
        }

        $scope.showError = function() {
            var errorPopup = $ionicPopup.alert({
                title: '',
                template: 'There was a problem with the register, please try again'
            });

            errorPopup.then(function(res) {
                console.log(res);
            });
        }

        $scope.doRegister = function() {

            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles" class="spinner-balanced">'
            });

            //Create a new user on Parse
            var user = new Parse.User();

            user.set("username", $scope.auth.email);
            user.set("name", $scope.auth.name);
            user.set("lastname", $scope.auth.lastname);
            user.set("phone", $scope.auth.phone);
            user.set("email", $scope.auth.email);
            user.set("password", $scope.auth.password);
            user.set("role", $scope.auth.role);
            user.set("active", $scope.auth.active);

            user.signUp(null, {
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