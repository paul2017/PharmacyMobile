(function() {
    'use strict';

    angular
        .module('cofasa.home')
        .controller('InboxController', InboxController);

    InboxController.$inject = ['$scope', '$state', '$rootScope', '$ionicLoading', 'InboxService', 'SharedMemService'];

    function InboxController($scope, $state, $rootScope, $ionicLoading, InboxService, SharedMemService) {

        $scope.initInbox = function() {

            $scope.news = [];
            $scope.poll = [];
            $scope.allNewsPoll = [];
            $scope.newsReady = false;
            $scope.pollReady = false;

            var date = new Date();

            InboxService.getNews(date).then(
                function(news) {
                    for(var i=0; i<news.length; i++) {

                        var photo = news[i].get('photo') ? news[i].get('photo').url() : '';
                        var title = news[i].get('title');
                        var text = news[i].get('text');
                        var date = new Date(news[i].get('date'));

                        $scope.news.push(
                            {
                                type: 'news',
                                title: title,
                                photo: photo,
                                text: text,
                                dateEnd: date
                            }
                        );
                    }

                    $scope.newsReady = true;
                },
                function(error) {
                    $scope.newsReady = true;
                }
            );

            InboxService.getPoll(date).then(
                function(poll) {
                    for(var i=0; i<poll.length; i++) {

                        var title = poll[i].get('title');
                        var questions = poll[i].get('questions');
                        var dateInit = new Date(poll[i].get('dateInit'));
                        var dateEnd = new Date(poll[i].get('dateEnd'));
                        var enableAnswer = dateEnd > date ? 1 : 0;

                        $scope.poll.push(
                            {
                                type: 'poll',
                                title: title,
                                photo: '',
                                questions: questions,
                                answers: [],
                                comment: '',
                                dateInit: dateInit,
                                dateEnd: dateEnd,
                                enableAnswer: enableAnswer,
                                object: poll[i]
                            }
                        );
                    }

                    $scope.pollReady = true;
                },
                function(error) {
                    $scope.pollReady = true;
                }
            );
        }

        $scope.$on("$ionicView.beforeEnter", function() {
            $scope.readyToShow = false;

            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles" class="spinner-balanced">'
            });

            $scope.initInbox();
        });

        $scope.sort = function() {

            $scope.allNewsPoll = $scope.news.concat($scope.poll);

            console.log($scope.allNewsPoll);
            $scope.allNewsPoll.sort(function(article1, article2) {
                return article1.dateEnd > article2.dateEnd ? 1: -1;
            });

            console.log('after sort');
            console.log($scope.allNewsPoll);
        }

        $scope.$watch('newsReady', function() {
            console.log('newsReady: ' + $scope.newsReady);

            if ($scope.newsReady && $scope.pollReady) {
                $scope.sort();
                $scope.readyToShow = true;
                $ionicLoading.hide();
            }
        });

        $scope.$watch('pollReady', function() {
            console.log('pollReady: ' + $scope.pollReady);

            if ($scope.newsReady && $scope.pollReady) {
                $scope.sort();
                $scope.readyToShow = true;
                $ionicLoading.hide();
            }
        });

        $scope.goArticle = function(index) {

            var article = $scope.allNewsPoll[index];

            if (article.type == 'news') {
                SharedMemService.set('currentNews', article);
                $state.go('home.news', {id:index});
            }
            else {
                SharedMemService.set('currentPoll', article);
                $state.go('home.poll', {id:index});
            }
        }
    }
})();