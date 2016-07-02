(function() {
    'use strict';

    angular
        .module('cofasa.home')
        .controller('SettingController', SettingController);

    SettingController.$inject = ['$scope', '$state', '$rootScope', '$ionicLoading'];

    function SettingController($scope, $state, $rootScope, $ionicLoading) {

        $scope.$on("$ionicView.beforeEnter", function() {

            $scope.error = false;
            $scope.errorMessage = "";


            $scope.auth = {};

            $scope.auth.name = $rootScope.sessionUser.get('name');
            $scope.auth.lastname = $rootScope.sessionUser.get('lastname');
            $scope.auth.phone = $rootScope.sessionUser.get('phone');
            $scope.auth.email = $rootScope.sessionUser.get('email');
        });

        $scope.changePassword = function() {
            Parse.User.requestPasswordReset($scope.auth.email, {
                success: function() {
                    // Password reset request was sent successfully
                },
                error: function(error) {
                    // Show the error message somewhere
                    $scope.error = true;
                    $scope.errorMessage = "There was a problem with the password reset, please try again";
                }
            });
        }

        $scope.save = function() {

            $scope.error = false;
            $scope.errorMessage = "";

            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles" class="spinner-balanced">'
            });

            $rootScope.sessionUser.set("username", $scope.auth.email);
            $rootScope.sessionUser.set("name", $scope.auth.name);
            $rootScope.sessionUser.set("lastname", $scope.auth.lastname);
            $rootScope.sessionUser.set("phone", $scope.auth.phone);
            $rootScope.sessionUser.set("email", $scope.auth.email);

            $rootScope.sessionUser.save().then(
                function(user) {
                    console.log('ss');
                    console.log(user);
                    $ionicLoading.hide();
                    return user.fetch();
                }
            ).then(
                function(user) {
                    console.log(user);
                    $ionicLoading.hide();
                },
                function(error) {
                    console.log(error);
                    $ionicLoading.hide();
                }
            );
        }

        $scope.logout = function() {
            Parse.User.logOut();
            $rootScope.sessionUser = null;
            $state.go('auth.login');
        }
    }
})();