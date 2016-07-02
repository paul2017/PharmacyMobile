(function() {
    'use strict';

    angular
        .module('cofasa.tutorial')
        .controller('TutorialController', TutorialController);

    TutorialController.$inject = ['$scope', '$state'];

    function TutorialController($scope, $state) {

        $scope.doStart = function() {
            $state.go('auth.login');
        }
    }
})();