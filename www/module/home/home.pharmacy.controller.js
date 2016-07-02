(function() {
    'use strict';

    angular
        .module('cofasa.home')
        .controller('PharmacyController', PharmacyController);

    PharmacyController.$inject = ['$scope', '$state', '$stateParams', '$rootScope', 'PharmacyService'];

    function PharmacyController($scope, $state, $stateParams, $rootScope, PharmacyService) {

        $scope.pharmacyId = $stateParams.id;

        var pharmacyServices = [
            "Consulta Farmacéutica",
            "Despacho de recetas",
            "Toma de Presión",
            "Inyectables",
            "Servicio Express",
            "Pago de Servicios Públicos",
            "Recargas Télefonicas"
        ];

        $scope.dayOfWeek = [
            "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"
        ];

        $scope.activePlans = [];
        $scope.activePromotions = [];
        $scope.schedule = [];
        $scope.services = [];
        $scope.photo = '';

        $scope.$on('$ionicView.beforeEnter', function() {
            console.log('PharmacyId : ' + $stateParams.id);

            $scope.activePlans = [];
            $scope.activePromotions = [];
            $scope.schedule = [];
            $scope.services = [];

            $scope.pharmacyId = $stateParams.id;

            PharmacyService.getPharmacy($scope.pharmacyId).then(
                function(pharmacy) {
                    $scope.pharmacy = pharmacy;

                    $scope.photo = $scope.pharmacy.get('photo') ? $scope.pharmacy.get('photo').url() : '';
                    $scope.name = $scope.pharmacy.get('name');
                    $scope.distrito = $scope.pharmacy.get('distrito');
                    $scope.canton = $scope.pharmacy.get('canton');
                    $scope.provincia = $scope.pharmacy.get('provincia');
                    $scope.phone = $scope.pharmacy.get('phone');
                    $scope.phone2 = $scope.pharmacy.get('phone2');

                    // Schedule
                    var weekTime = $scope.pharmacy.get('openHours');

                    for(var i=0; i<7; i++) {
                        var startTime = weekTime[i*2];
                        var closeTime = weekTime[i*2 + 1];

                        $scope.schedule.push({
                            startTime: startTime,
                            closeTime: closeTime
                        });
                    }

                    // Service
                    var services = $scope.pharmacy.get('services');

                    for(var i=0; i<7; i++) {
                        if (services[i] == true) {
                            $scope.services.push(pharmacyServices[i]);
                        }
                    }

                    // Get current date
                    var date = new Date();

                    // Get active plans
                    var plans = $scope.pharmacy.get('plans');

                    if (plans !== undefined && plans != null) {

                        for(var i=0; i<plans.length; i++) {
                            var dateInit = new Date(plans[i].get('dateInit'));
                            var dateEnd = new Date(plans[i].get('dateEnd'));
                            var active = plans[i].get('active');

                            if (active == true && dateInit < date && dateEnd > date) {
                                var photo = (plans[i].get('photo')) ? plans[i].get('photo').url() : '';
                                var title = plans[i].get('title');
                                var description = plans[i].get('description');

                                $scope.activePlans.push({
                                    photo: photo,
                                    title: title,
                                    description: description,
                                    dateInit: dateInit,
                                    dateEnd: dateEnd
                                });
                            }
                        }
                    }

                    // Get active promotions for this pharmacy
                    PharmacyService.getActivePromotions($scope.pharmacy, date).then(
                        function(promotions) {
                            for (var i=0; i<promotions.length; i++) {

                                var photo = promotions[i].get('photo') ? promotions[i].get('photo').url() : '';
                                var title = promotions[i].get('title');
                                var description = promotions[i].get('description');
                                var dateInit = new Date(promotions[i].get('dateInit'));
                                var dateEnd = new Date(promotions[i].get('dateEnd'));

                                $scope.activePromotions.push({
                                    photo: photo,
                                    title: title,
                                    description: description,
                                    dateInit: dateInit,
                                    dateEnd: dateEnd
                                });
                            }
                        },
                        function(error) {

                        }
                    );

                    // Add a row in PharmacyVisited table
                    PharmacyService.savePharmacyVisited($rootScope.sessionUser, $scope.pharmacy).then(
                        function(pharmacyVisited) {

                        },
                        function(error) {

                        }
                    );

                },
                function(error) {

                }
            );
        });
    }
})();