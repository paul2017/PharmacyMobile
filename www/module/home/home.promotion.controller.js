(function() {
    'use strict';

    angular
        .module('cofasa.home')
        .controller('PromotionController', PromotionController);

    PromotionController.$inject = ['$scope', '$state', '$rootScope', '$ionicLoading', 'PromotionService', '$cordovaGeolocation'];

    function PromotionController($scope, $state, $rootScope, $ionicLoading, PromotionService, $cordovaGeolocation) {

        // Current user's position
        $scope.userLat = 0;
        $scope.userLng = 0;

        $scope.initPromotions = function() {

            // Active promotions
            $scope.activePromotions = [];

            // Get current geo location
            var posOptions = { timeout: 10000, enableHighAccuracy: false };

            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles" class="spinner-balanced">'
            });

            $cordovaGeolocation.getCurrentPosition(posOptions).then(
                function(position) {
                    console.log('location: ' + position.coords.latitude + ' ' + position.coords.longitude);

                    $scope.userLat = position.coords.latitude;
                    $scope.userLng = position.coords.longitude;

                    $scope.getPromosions();
                },
                function(error) {
                    console.log('Error getCurrentPosition: ' + error.message);

                    // Test
                    $scope.getPromosions();
                }
            );
        }

        $scope.getPromosions = function() {
            var date = new Date();

            PromotionService.getActivePromotions(date).then(
                function(promotions) {

                    for(var i=0; i<promotions.length; i++) {

                        var pharmacy = promotions[i].get('pharmacy');

                        var pharmacyName = pharmacy.get('name');
                        var pharmacyLat = pharmacy.get('latitude');
                        var pharmacyLng = pharmacy.get('longitude');

                        var distance = MapUtil.getDistanceBetweenPoints(
                            {
                                lat: $scope.userLat,
                                lng: $scope.userLng
                            },
                            {
                                lat: pharmacyLat,
                                lng: pharmacyLng
                            },
                            'km'
                        );

                        distance = distance.toFixed(1) + ' km';

                        var title = promotions[i].get('title');
                        var photo = promotions[i].get('photo') ? promotions[i].get('photo').url() : '';
                        var description = promotions[i].get('description');
                        var dateInit = new Date(promotions[i].get('dateInit'));
                        var dateEnd = new Date(promotions[i].get('dateEnd'));

                        $scope.activePromotions.push({
                            pharmacyName: pharmacyName,
                            pharmacyLat: pharmacyLat,
                            pharmacyLng: pharmacyLng,
                            distance: distance,
                            photo: photo,
                            title: title,
                            description: description,
                            dateInit: dateInit,
                            dateEnd: dateEnd
                        });
                    }

                    // Sort by distance
                    $scope.activePromotions.sort(function(promotion1, promotion2) {
                        return promotion1.distance > promotion2.distance ? 1: -1;
                    });

                    for (var i=0; i<$scope.activePromotions.length; i++) {
                        console.log('Distance: ' + $scope.activePromotions[i].distance);
                    }

                    $ionicLoading.hide();
                },
                function(error) {
                    $ionicLoading.hide();
                }
            );
        }

        $scope.goWaze = function(lat, lng) {
            WazeLink.open('waze://?ll='+lat+','+lng);
        }

        $scope.$on("$ionicView.beforeEnter", function() {
            $scope.initPromotions();
        });

    }
})();