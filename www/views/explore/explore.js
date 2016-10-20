angular.module('App')
    .controller('exploreCtrl',
        function($scope, $ionicFilterBar, $translate, $state, eventService, Utils, $window, $filter, $ionicScrollDelegate, countriesFilter) {
            var iso_height = ionic.Platform.isFullScreen & ionic.Platform.isIOS() ? 20 : 0;
            $scope.height = $window.innerHeight - (44 + iso_height);
            var statusHolder = {
                feature: {
                    api: 'feature',
                    loading: false,
                    loaded: false,
                    page: 2,
                    end: false,
                    events: []
                },
                calendar: {
                    api: 'calendar',
                    loading: false,
                    loaded: false,
                    page: 1,
                    end: false,
                    events: []
                }
            }
            var modeSelect = statusHolder.feature.api;
            $scope.isFeature = function() {
                return modeSelect == statusHolder.feature.api;
            };

            $scope.modeSwitch = function() {
                var sh;
                if ($scope.isFeature()) {
                    sh = statusHolder.calendar;
                    if (sh.events.length == 0) $scope.calendar_load();
                } else {
                    $scope.showUp = false;
                    sh = statusHolder.feature;
                }
                modeSelect = sh.api;
                $scope.end = sh.end;
            }

            $scope.hasMore = function() {
                return $scope.isFeature() ? !statusHolder.feature.end : !statusHolder.calendar.end;
            }

            function getStatusHolder() {
                return $scope.isFeature() ? statusHolder.feature : statusHolder.calendar;
            }

            $scope.doRefresh = function() {
                var sh = getStatusHolder();
                if (sh.loaded) {
                    sh.loaded = false;
                    sh.events = [];
                    sh.end = false;

                    if ($scope.isFeature()) {
                        sh.page = 2;
                        $scope.feature_load();
                    } else {
                        sh.page = 1;
                        $scope.calendar_load();
                    }
                } else {
                    $scope.$broadcast('scroll.refreshComplete');
                }
            }

            $scope.bannerClick = function(event) {
                $state.go('app.event', { event: JSON.stringify(event) });
            }

            $scope.events = [];

            $scope.feature_load = function() {
                var sh = statusHolder.feature;
                if (sh.loaded) {
                    if (!sh.loading & !sh.end) {
                        sh.loading = true;
                        eventService.events(sh.page, sh.api).then(function(res) {
                            // console.log(res);
                            var event_length = res.events.length;
                            if (event_length > 0) {
                                sh.events = sh.events.concat(res.events);
                                $scope.events = sh.events;
                                if (event_length < 30) sh.end = true;
                            }
                            sh.loading = false;
                            sh.page++;
                            $scope.$broadcast('scroll.infiniteScrollComplete');

                        }, Utils.errMessage);
                    }
                } else {
                    eventService.events().then(function(res) {
                        // console.log(res);
                        var feature = res.feature;
                        $scope.feature = [res.events[0]];
                        // $scope.group_event = feature.group;

                        if (res.events.length > 0) {
                            sh.events = sh.events.concat(res.events);
                            $scope.events = sh.events;
                            $scope.msg_feature = '';
                        } else {
                            $scope.msg_feature = $translate.instant('error_others');
                        }

                        if (res.events.length < 30) sh.end = true;

                        sh.loading = false;
                        sh.loaded = true;
                        $scope.$broadcast('scroll.refreshComplete');
                    }, function(err) {
                        Utils.errMessage(err);
                        sh.end = true;
                    });
                }
            }

            $scope.group = [];

            $scope.calendar_load = function() {
                var sh = statusHolder.calendar;

                if (!sh.loading & !sh.end) {
                    if (sh.loaded & $scope.isFeature()) return;
                    sh.loading = true;
                    eventService.events(sh.page, sh.api).then(function(res) {
                        var event_length = 0;
                        if (res.events != null) {
                            event_length = res.events.length;
                        }

                        if (event_length > 0) {
                            sh.events = sh.events.concat(res.events);
                            $scope.group = groupEvent(sh.events);
                            sh.page++;
                            if (event_length < 30) sh.end = true;
                        } else {
                            sh.end = true;
                            $scope.msg_calendar = $translate.instant('error_others');
                        }

                        sh.loading = false;
                        sh.loaded = true;

                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }, Utils.errMessage);
                    if (sh.loaded) $scope.$broadcast('scroll.refreshComplete');
                }
            }

            function groupEvent(events) {
                var new_events = [];
                var group_event = [];
                events.forEach(function(event) {
                    var d = $filter('date')(event.start * 1000, 'd/MM/yy');
                    if (!group_event.hasOwnProperty(d)) {
                        group_event[d] = [];
                        group_event[d].start = event.start;
                        group_event[d].events = [];
                    }
                    if (group_event[d].events.indexOf(event) == -1) group_event[d].events.push(event);
                    // console.log(group_event[d].events.indexOf(event));
                }, this);

                for (var key in group_event) {
                    var event = {
                        divider: group_event[key].start,
                        events: group_event[key].events
                    }
                    new_events.push(event);
                }

                new_events.sort(function(a, b) {
                    return a.divider - b.divider
                })
                return new_events;
            }

            $scope.scrollToUp = function() {
                var handle = $scope.isFeature() ? 'feature' : 'calendar';
                $ionicScrollDelegate.$getByHandle(handle).scrollTop(true);
            }

            $scope.getScrollPosistion = function() {
                $scope.$apply(function() {
                    // var handle = $scope.isFeature() ? 'feature' : 'calendar';
                    if (!$scope.isFeature()) {
                        var top = $ionicScrollDelegate.$getByHandle('calendar').getScrollPosition().top;
                        // console.log(top);
                        $scope.showUp = top > $window.innerHeight - 161;
                    } else {
                        $scope.showUp = false;
                    }

                });
            }

            $scope.showUp = false;

            $scope.showFilterBar = function() {
                $state.go('app.eventFilterList');
                /*
                $ionicFilterBar.show({
                    cancelText: $translate.instant('btn_cancel'),
                    items: $scope.isFeature() ? $scope.events : statusHolder.calendar.events,
                    scope: $scope,
                    update: function (filteredItems, filterText) {
                        if ($scope.isFeature()) {
                            $scope.events = filteredItems;
                        } else {
                            $scope.group = groupEvent(filteredItems);
                        }

                        if (filterText) {
                            console.log(filterText);
                        }
                    }
                });
                */
            };
        });