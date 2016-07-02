(function() {
    'use strict';

    angular
        .module('cofasa.home')
        .factory('InboxService', InboxService);

    InboxService.$inject = ['$q'];

    function InboxService($q) {
        var service = {};

        // Get news
        service.getNews = function(date) {

            var deferred = $q.defer();

            var allResult = [];

            function getAllRecords(loopCount) {
                var limit = 1000;

                var queryNews = new Parse.Query('News');

                queryNews.limit(limit);
                queryNews.skip(limit * loopCount);

                queryNews.lessThanOrEqualTo('date', date);

                queryNews.find({
                    success: function(results) {
                        console.log('getNews result: ' + results.length);

                        if (results.length > 0) {
                            allResult = allResult.concat(results);
                            loopCount++;
                            getAllRecords(loopCount);
                        }
                        else {
                            deferred.resolve(allResult);
                        }
                    },
                    error: function(error) {
                        console.log('Error query : ' + error.message);
                        deferred.reject(error);
                    }
                });
            }

            getAllRecords(0);

            return deferred.promise;
        }

        // Get poll
        service.getPoll = function(date) {

            var deferred = $q.defer();

            var allResult = [];

            function getAllRecords(loopCount) {
                var limit = 1000;

                var queryPoll = new Parse.Query('Poll');

                queryPoll.limit(limit);
                queryPoll.skip(limit * loopCount);

                queryPoll.lessThan('dateInit', date);
                queryPoll.equalTo('sentTo', 'Consumidores Finales');

                queryPoll.find({
                    success: function(results) {
                        console.log('getPoll result: ' + results.length);

                        if (results.length > 0) {
                            allResult = allResult.concat(results);
                            loopCount++;
                            getAllRecords(loopCount);
                        }
                        else {
                            deferred.resolve(allResult);
                        }
                    },
                    error: function(error) {
                        console.log('Error query : ' + error.message);
                        deferred.reject(error);
                    }
                });
            }

            getAllRecords(0);

            return deferred.promise;
        }

        // Get poll answer
        service.getPollAnswer = function(poll, user) {
            var deferred = $q.defer();

            var queryPollAnswer = new Parse.Query('PollAnswer');

            queryPollAnswer.equalTo('poll', poll);
            queryPollAnswer.equalTo('user', user);

            queryPollAnswer.find({
                success: function(results) {
                    console.log('getPollAnswer: ' + results.length);
                    deferred.resolve(results);
                },
                error: function(error) {
                    console.log('Error query : ' + error.message);
                    deferred.reject(error);
                }
            });

            return deferred.promise;
        }

        // Save poll
        service.savePoll = function(poll, user, answers, comment) {
            var deferred = $q.defer();

            var PollAnswer = Parse.Object.extend("PollAnswer");
            var pollAnswer = new PollAnswer();

            pollAnswer.set("poll", poll);
            pollAnswer.set("user", user);
            pollAnswer.set("answers", answers);
            pollAnswer.set("comments", comment);

            pollAnswer.save(null, {
                success: function(pollAnswer) {
                    console.log('savePollAnswer: ' + pollAnswer);
                    deferred.resolve(pollAnswer);
                },
                error: function(pollAnswer, error) {
                    console.log('Error save : ' + error.message);
                    deferred.reject(error);
                }
            });

            return deferred.promise;
        }

        return {
            getNews: service.getNews,
            getPoll: service.getPoll,
            getPollAnswer: service.getPollAnswer,
            savePoll: service.savePoll
        }
    }
})();