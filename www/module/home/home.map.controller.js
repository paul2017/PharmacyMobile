(function() {
    'use strict';

    angular
        .module('cofasa.home')
        .controller('MapController', MapController);

    MapController.$inject = ['$scope', '$state', '$rootScope', '$cordovaGeolocation', '$ionicLoading', 'MapService'];

    function MapController($scope, $state, $rootScope, $cordovaGeolocation, $ionicLoading, MapService) {

        $scope.search = {
            keyword: ''
        };

        $scope.map = null;
        $scope.markerCache = [];

        // Google map marker
        var marker_blue_image = {
            url: 'img/map-pin-blue.png',
            size: new google.maps.Size(41, 44),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 44)
        };

        var marker_yellow_image = {
            url: 'img/map-pin-yellow.png',
            size: new google.maps.Size(41, 44),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 44)
        };

        $scope.$on("$ionicView.beforeEnter", function() {

        });

        $scope.$on('$ionicView.beforeLeave', function() {
            if ($scope.infoWindow) {
                $scope.infoWindow.close();
            }
        });

        $scope.markerExists = function(lat, lng) {
            var exists = false;
            var cache = $scope.markerCache;
            for(var i = 0; i < cache.length; i++){
                if(cache[i].lat === lat && cache[i].lng === lng){
                    exists = true;
                }
            }

            return exists;
        }

        // Utils for google map javascript
        function convertToLatLng(lat, lng) {
            return new google.maps.LatLng(lat, lng);
        }

        // Init map with geo-location
        $scope.initMap = function() {

            // Get current geo location
            var posOptions = { timeout: 10000, enableHighAccuracy: false };

            $cordovaGeolocation.getCurrentPosition(posOptions).then(
                function(position) {
                    console.log('location: ' + position.coords.latitude + ' ' + position.coords.longitude);
                    $scope.createMap(position.coords.latitude, position.coords.longitude);
                },
                function(error) {
                    console.log('Error getCurrentPosition: ' + error.message);

                    // Test
                    $scope.createMap(9.9766, -84.0071);
                }
            );
        }

        $scope.createMap = function(lat, lng) {

            var location = convertToLatLng(lat, lng);

            var mapOptions = {
                center: location,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: false
            }

            $scope.map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

            //Wait until the map is loaded
            google.maps.event.addListenerOnce($scope.map, 'idle', function(){
                console.log("Map idle!");
                $scope.loadMarkers();

                //Reload markers every time the map moves
                google.maps.event.addListener($scope.map, 'dragend', function(){
                    console.log("Map moved!");
                    $scope.loadMarkers();
                });

                //Reload markers every time the zoom changes
                google.maps.event.addListener($scope.map, 'zoom_changed', function(){
                    console.log("Map zoomed!");
                    $scope.loadMarkers();
                });
            });
        }

        // Load markers
        $scope.loadMarkers = function() {

            var center = $scope.map.getCenter();
            var bounds = $scope.map.getBounds();
            var zoom = $scope.map.getZoom();

            //Convert objects returned by Google to be more readable
            var centerNorm = {
                lat: center.lat(),
                lng: center.lng()
            };

            var boundsNorm = {
                northeast: {
                    lat: bounds.getNorthEast().lat(),
                    lng: bounds.getNorthEast().lng()
                },
                southwest: {
                    lat: bounds.getSouthWest().lat(),
                    lng: bounds.getSouthWest().lng()
                }
            };

            // Get pharmacies
            MapService.getPharmacies(boundsNorm, $scope.search.keyword).then(
                function(pharmacies) {
                    for (var i=0; i<pharmacies.length; i++) {

                        var lat = pharmacies[i].get('latitude');
                        var lng = pharmacies[i].get('longitude');

                        // Check if the marker has already been added
                        if (! $scope.markerExists(lat, lng)) {
                            var markerPos = convertToLatLng(lat, lng);
                            var markerType = 0;
                            var markerIcon;

                            if (markerType == 0) {
                                markerIcon = marker_blue_image;
                            }
                            else {
                                markerIcon = marker_yellow_image;
                            }

                            // Add the marker to the map
                            var marker = new google.maps.Marker({
                                map: $scope.map,
                                position: markerPos,
                                icon: markerIcon
                            });

                            // Add the marker to the markerCache so we know not to add it again later
                            var markerData = {
                                lat: lat,
                                lng: lng,
                                type: markerType,
                                marker: marker
                            };

                            $scope.markerCache.push(markerData);

                            // Add info window
                            $scope.addInfoWindow(marker, pharmacies[i]);
                        }
                    }
                },
                function(error) {

                }
            );
        }

        $scope.clearMarkers = function() {
            for(var i=0; i<$scope.markerCache.length; i++) {
                $scope.markerCache[i].marker.setMap(null);
            }

            $scope.markerCache.length = 0;
        }

        // Add info window
        $scope.addInfoWindow = function(marker, pharmacy) {

            var id = pharmacy.id;
            var name = pharmacy.get('name');
            var photo = (pharmacy.get('photo')) ? pharmacy.get('photo').url():'';
            var address = pharmacy.get('address');
            var distrito = pharmacy.get('distrito');
            var canton = pharmacy.get('canton');
            var provincia = pharmacy.get('provincia');

            address = address + ', ' + distrito + ', ' + canton;

            var content =
                "<div class='info-window'>" +
                    "<span class='pharmacy-photo'>" +
                        "<img src='" + photo + "'>" +
                    "</span>" +
                    "<span class='name'>" + name + "</span>" +
                    "<span class='address'><p>" + "<span class='bold'>Address : </span>" + address + "</p></span>" +
                    "<div class='detail'><a class='button button-small button-calm' href='#/home/pharmacy/" + id + "'>Detail</a>" +
                "</div>";

            google.maps.event.addListener(marker, 'click', function () {

                if ($scope.infoWindow) {
                    $scope.infoWindow.close();
                }

                $scope.infoWindow = new google.maps.InfoWindow({
                    content: content
                });

                $scope.infoWindow.open($scope.map, marker);
            });
        }

        // Search box
        $scope.goSearch = function() {

            $scope.clearMarkers();
            $scope.loadMarkers();
        }

        $scope.initMap();
    }

})();