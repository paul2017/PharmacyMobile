(function() {
    'use strict';

    angular
        .module('cofasa.home')
        .controller('NewsController', NewsController);

    NewsController.$inject = ['$scope', '$state', '$stateParams', '$rootScope', 'SharedMemService'];

    function NewsController($scope, $state, $stateParams, $rootScope, SharedMemService) {

        $scope.$on("$ionicView.beforeEnter", function() {
            $scope.news = SharedMemService.get('currentNews');
        });
    }
})();