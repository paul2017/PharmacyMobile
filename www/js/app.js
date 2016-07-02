angular.module('cofasa', [
        'ionic',

        'cofasa.common',
        'cofasa.tutorial',
        'cofasa.auth',
        'cofasa.home',

        'ngCordova',
        'tmh.dynamicLocale',
        'pascalprecht.translate'
    ])

    .constant('availableLanguages', ['en-US', 'es-CR'])
    .constant('defaultLanguage', 'en-US')
    .constant('PARSE_APP_ID', 'QcsvayzZXIOvjqdebxOBsYe7SVNJSiAZFM6PvgAl')
    .constant('PARSE_JAVASCRIPT_KEY', 'SBe5wQOmBGGHbcs80QP1blU6XSo4ueqtMelCIJAS')

    .run(function($ionicPlatform, PARSE_APP_ID, PARSE_JAVASCRIPT_KEY) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }

            // Init parse
            Parse.initialize(PARSE_APP_ID, PARSE_JAVASCRIPT_KEY);
        });
    })

    .run(['$rootScope', '$state',  function($rootScope, $state) {
        Parse.initialize("QcsvayzZXIOvjqdebxOBsYe7SVNJSiAZFM6PvgAl", "SBe5wQOmBGGHbcs80QP1blU6XSo4ueqtMelCIJAS");
        $rootScope.sessionUser = Parse.User.current();

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

            if (! (toState.name == 'tutorial' || toState.name == 'auth' || toState.name == 'auth.signup' || toState.name == 'auth.login')) {
                if ($rootScope.sessionUser == null) {
                    $state.go('auth.login');
                }
            }
        });
    }])

    .config(function (tmhDynamicLocaleProvider, $translateProvider, defaultLanguage) {
        tmhDynamicLocaleProvider.localeLocationPattern('locales/angular-locale_{{locale}}.js');
        $translateProvider.useStaticFilesLoader({
            'prefix': 'i18n/',
            'suffix': '.json'
        });
        $translateProvider.preferredLanguage(defaultLanguage);
    })

    .config(function($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            .state('tutorial', {
                url: '/tutorial',
                templateUrl: 'module/tutorial/tutorial.template.html',
                controller: 'TutorialController'
            })

            .state('auth', {
                url: '/auth',
                abstract: true,
                templateUrl: 'module/auth/auth.template.html'
            })

            .state('auth.signup', {
                url: '/signup',
                views: {
                    'auth-signup': {
                        templateUrl: 'module/auth/auth.signup.template.html',
                        controller: 'SignupController'
                    }
                }
            })

            .state('auth.login', {
                url: '/login',
                views: {
                    'auth-login': {
                        templateUrl: 'module/auth/auth.login.template.html',
                        controller: 'LoginController'
                    }
                }
            })

            .state('home', {
                url: '/home',
                abstract: true,
                templateUrl: 'module/home/home.template.html'
            })

            .state('home.map', {
                url: '/map',
                views: {
                    'home-map': {
                        templateUrl: 'module/home/home.map.template.html',
                        controller: 'MapController'
                    }
                }
            })

            .state('home.pharmacy', {
                url: '/pharmacy/:id',
                views: {
                    'home-map': {
                        templateUrl: 'module/home/home.pharmacy.template.html',
                        controller: 'PharmacyController'
                    }
                }
            })

            .state('home.promotion', {
                url: '/promotion',
                views: {
                    'home-promotion': {
                        templateUrl: 'module/home/home.promotion.template.html',
                        controller: 'PromotionController'
                    }
                }
            })

            .state('home.inbox', {
                url: '/inbox',
                views: {
                    'home-inbox': {
                        templateUrl: 'module/home/home.inbox.template.html',
                        controller: 'InboxController'
                    }
                }
            })

            .state('home.news', {
                url: '/news/:id',
                views: {
                    'home-inbox': {
                        templateUrl: 'module/home/home.news.template.html',
                        controller: 'NewsController'
                    }
                }
            })

            .state('home.poll', {
                url: '/poll/:id',
                views: {
                    'home-inbox': {
                        templateUrl: 'module/home/home.poll.template.html',
                        controller: 'PollController'
                    }
                }
            })

            .state('home.setting', {
                url: '/setting',
                views: {
                    'home-setting': {
                        templateUrl: 'module/home/home.setting.template.html',
                        controller: 'SettingController'
                    }
                }
            })
          ;

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/tutorial');

    });
