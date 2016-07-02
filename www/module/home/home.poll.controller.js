(function() {
    'use strict';

    angular
        .module('cofasa.home')
        .controller('PollController', PollController);

    PollController.$inject = ['$scope', '$state', '$stateParams', '$rootScope', '$ionicHistory', '$ionicLoading', 'SharedMemService', 'InboxService'];

    function PollController($scope, $state, $stateParams, $rootScope, $ionicHistory, $ionicLoading, SharedMemService, InboxService) {

        $scope.$on("$ionicView.beforeEnter", function() {

            $scope.readyToShow = false;
            $scope.error = false;
            $scope.errorMessage = "";

            $scope.poll = SharedMemService.get('currentPoll');

            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles" class="spinner-balanced">'
            });

            InboxService.getPollAnswer(SharedMemService.get('currentPoll').object, $rootScope.sessionUser).then(
                function(pollAnswers) {

                    if (pollAnswers.length > 0) {
                        $scope.readOnly = true;

                        var answers = pollAnswers[0].get('answers');

                        for(var i=0; i<answers.length; i++) {
                            $scope.poll.answers.push(answers[i]);
                        }

                        $scope.poll.comment = pollAnswers[0].get('comments');
                    }
                    else {
                        $scope.readOnly = false;

                        for(var i=0; i<$scope.poll.questions.length; i++) {
                            $scope.poll.answers.push(-1);
                        }
                    }

                    $scope.readyToShow = true;
                    $ionicLoading.hide();
                },
                function(error) {
                    $scope.readOnly = false;

                    for(var i=0; i<$scope.poll.questions.length; i++) {
                        $scope.poll.answers.push(-1);
                    }

                    $scope.readyToShow = true;
                    $ionicLoading.hide();
                }
            );
        });

        $scope.save = function() {

            $scope.error = false;
            $scope.errorMessage = "";

            for(var i = 0; i < $scope.poll.questions.length; i++) {
                if($scope.poll.answers[i] == -1) {
                    $scope.error = true;
                    $scope.errorMessage += "Por favor responda todas las preguntas<br>";
                    return;
                }
            }

            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles" class="spinner-balanced">'
            });

            InboxService.savePoll($scope.poll.object, $rootScope.sessionUser, $scope.poll.answers, $scope.poll.comment).then(
                function(pollAnswer) {
                    $ionicLoading.hide();
                    $ionicHistory.goBack();
                },
                function(error) {
                    $scope.error = true;
                    $scope.errorMessage += "Hubo un error al guardar las respuestas, por favor intente de nuevo<br>";
                    $ionicLoading.hide();
                }
            );
        }

    }
})();