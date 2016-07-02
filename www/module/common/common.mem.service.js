(function() {
    'use strict';

    angular
        .module('cofasa.common')
        .factory('SharedMemService', SharedMemService);

    SharedMemService.$inject = [];

    function SharedMemService() {
        var service = {};

        service.mem = [];

        service.set = function(key, val) {
            service.mem[key] = val;
        }

        service.get = function(key) {
            return service.mem[key];
        }

        service.reset = function() {
            service.mem = [];
        }

        return {
            set: service.set,
            get: service.get,
            reset: service.reset
        }
    }
})();