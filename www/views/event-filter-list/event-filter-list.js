angular.module('App')
    .controller('listCtrl', function ($scope, $stateParams, $window, $translate, Utils, $ionicScrollDelegate, eventService, countriesFilter) {
        // $scope.search = $stateParams.search;
        var statusHolder = {
            loading: false,
            loaded: false,
            events: [],
            end: false,
            page: 1,
            search: {
                country: '',
                search: ''
            },
        }

        function load() {
            var search = statusHolder.search;
            if (!statusHolder.loading & !statusHolder.loaded) {
                if (search.search == '' & search.country == '') {
                    statusHolder.end = true;
                    return;
                }
                statusHolder.loading = true;
                eventService.search(search, statusHolder.page).then(function (res) {
                    var events = (res.events == null) ? [] : res.events;
                    statusHolder.events = statusHolder.events.concat(events);
                    if (events.length < 30) statusHolder.end = true;
                    $scope.msg = (statusHolder.events.length == 0) ? $translate.instant('empty_event') : '';
                    statusHolder.loaded = true;
                    statusHolder.loading = false;
                    $scope.events = statusHolder.events;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    statusHolder.page++;
                }, function (err) {
                    $scope.msg = $translate.instant('error_others');
                    statusHolder.end = true;
                    Utils.errMessage(err);
                });
            }
        }
        $scope.data = {};
        $scope.textSearch = function () {
            reset();
            statusHolder.search.search = $scope.data.search;
            load();
        }

        $scope.loadMore = function () {
            load();
        };

        $scope.hasMore = function () {
            return !statusHolder.end;
        }

        $scope.location = function () {
            countriesFilter.show($scope).then(function (country) {
                reset();
                $scope.search = country;
                statusHolder.search.country = country;
                load();
            });
        }

        $scope.showUp = false;
        $scope.getScrollPosistion = function () {
            $scope.$apply(function () {
                var top = $ionicScrollDelegate.$getByHandle('eventList').getScrollPosition().top;
                // console.log(top);
                $scope.showUp = top > $window.innerHeight - 161;
            });
        }

        $scope.scrollToUp = function () {
            $ionicScrollDelegate.$getByHandle('eventList').scrollTop(true);
        }

        $scope.reset = function () {
            reset();
            $scope.events = [];
            statusHolder.search = {
                country: '',
                search: ''
            };
            $scope.search ='';
            statusHolder.end = true;
        }

        function reset() {
            $scope.msg = '';
            statusHolder.page = 1;
            statusHolder.events = [];
            statusHolder.loaded = false;
            statusHolder.end = false;
        }
    });
