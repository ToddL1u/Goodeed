angular.module('App')
    .controller('profileCtrl', function ($scope, $translate, User, History,
     profileEditModal, eventService, userService, $ionicScrollDelegate, $window) {
        var iso_height = ionic.Platform.isFullScreen & ionic.Platform.isIOS() ? 20 : 0;
        $scope.height = $window.innerHeight - (44 + iso_height + 113);
        $scope.user = User.getUser();
        $scope.$watch(User.getUser, function () {
            $scope.user = User.getUser();
        });
        var statusHolder = {
            like: {
                loading: false,
                loaded: false,
                events: [],
                page: 1,
                end: false
            },
            history: {
                loading: false,
                loaded: false,
                page: 1,
                list: [],
                end: false,
            }
        }

        var sh = statusHolder.like;
        $scope.selectedIndex = 0;
        $scope.buttonClicked = function (index) {
            $scope.selectedIndex = index;
            if (index == 0) {
                sh = statusHolder.like;
            } else {
                sh = statusHolder.history;
                if (sh.list.length == 0 & !sh.loaded) $scope.history_load();
            }
            $scope.$apply();
        }
        function isLike() {
            return $scope.selectedIndex == 0;
        }

        $scope.like_load = function () {
            var sh = statusHolder.like;
            eventService.events(sh.page, 'like').then(function (res) {
                sh.page++;
                var events = (res.events == null) ? [] : res.events;
                sh.events = sh.events.concat(events);
                $scope.events = sh.events;
                if (sh.events.length == 0) {
                    $scope.empty_like = $translate.instant('empty_like');
                }
                if (events.length < 30) {
                    sh.end = true;
                }
            });
        }

        $scope.history_load = function () {
            var sh = statusHolder.history;
            History.getList(sh.page).then(function (res) {
                sh.page++;
                var histories = (res.histories == null) ? [] : res.histories;

                histories.forEach(function (ele) {
                    switch (ele.type) {
                        case 'share':
                            ele.type = $translate.instant('history_share');
                            break;
                        case 'join':
                            ele.type = $translate.instant('history_join');
                            break;
                        case 'quest':
                            ele.type = $translate.instant('history_quest');
                            break;
                        case 'reward':
                            ele.type = $translate.instant('history_reward');
                            break;
                        default:
                            break;
                    }
                }, this);

                sh.list = sh.list.concat(histories);
                $scope.historyList = sh.list;
                if (sh.list.length == 0) {
                    $scope.empty_history = $translate.instant('empty_history');
                }
                if (sh.list.length < 30) {
                    sh.end = true;
                }
            });
        }


        $scope.edit = function () {
            profileEditModal.init($scope)
                .then(function (modal) {
                    $scope.openModal();
                });
        }
        $scope.header_panel = true;

        $scope.hasMore = function () {
            return isLike() ? !statusHolder.like.end : !statusHolder.history.end;
        }

        userService.logoutCallback($scope);
    });