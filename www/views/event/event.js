angular.module('App')
    .controller('eventCtrl', function($scope, $ionicPopup, $cordovaDialogs, $translate, $filter,
        $state, $cordovaCalendar, shareDialog, eventService, $stateParams, Utils, userService,
        $cordovaInAppBrowser, eventShare, IonicClosePopupService) {
        $scope.showfooter = false;
        $scope.event = JSON.parse($stateParams.event);

        $scope.like_button = function() {
            if (userService.checkLogin($scope)) return;
            eventService.like($scope.event.event_id, $scope.event.liked).then(function(res) {

            });
            $scope.event.liked = $scope.event.liked ? false : true;

        }

        $scope.loaded = false;
        /*
        eventService.event($scope.event.event_id).then(function (res) {

            var event = res.event;
            event.content = trimString(event.content, 300);
            event.dateTime = dateTime(event);
            $scope.event = event;
            // $scope.loaded = true;
        }, Utils.errMessage);
*/
        function trimString(text, maximum) {
            return text.substring(0, maximum) + '...';
        }


        function dateTime(event) {
            var start = new Date(event.start * 1000);
            var end = new Date(event.end * 1000);
            var datatime = '';
            if (start.getFullYear() == end.getFullYear() && (start.getMonth() + 1) == (end.getMonth() + 1) && start.getDate() == end.getDate()) {
                datatime = $filter('date')(event.start * 1000, 'y-MM-d h:mm ~ ') + $filter('date')(event.end * 1000, 'h:mm');
            } else {
                datatime = $filter('date')(event.start * 1000, 'y-MM-d ~') + $filter('date')(event.end * 1000, 'y-MM-d');
            }
            return datatime;
        }


        $scope.more = function(link) {
            $state.go('app.webview', { url: link });
        }

        $scope.navigation = function() {
            var lat = $scope.event.lat;
            var lng = $scope.event.lng;
            $cordovaDialogs.confirm(
                $translate.instant('text_navigation'),
                $translate.instant('text_navigation_title'), [
                    $translate.instant('btn_cancel'),
                    $translate.instant('btn_navigation')
                ]
            ).then(function(buttonIndex) {
                if (buttonIndex == 2) {
                    Utils.loading();
                    userService.getLastLocation().then(function(res) {
                        Utils.hide();
                        if (ionic.Platform.isAndroid()) {
                            window.open("google.navigation:q=" + lat + "," + lng, '_system');
                        } else {
                            window.open("maps://?saddr=" + res.lat + "," + res.lng + "&daddr=" + lat + "," + lng, '_system');
                        }
                    }, function(err) {
                        Utils.hide();
                        console.log(err);
                    });
                }
            });
        }

        $scope.showPhoto = function() {
            var photo = $ionicPopup.show({
                template: '<div class="center" ng-click="dismissView()"><img style="margin-top:15px;width:90%;"  src="' + $scope.event.picture + '"></div>',
                scope: $scope,
                cssClass: 'dialog-transprant'
            });
            $scope.dismissView = function() {
                photo.close();
            }
            IonicClosePopupService.register(photo);
        }

        $scope.rewardInfor = function() {
            $ionicPopup.alert({
                title: $translate.instant('btn_reward_gain'),
                cssClass: 'popup-dialog',
                template: $translate.instant('text_reward_information'),
                okType: 'button-energized'
            });
        }

        $scope.calendar = function() {
            $cordovaDialogs.confirm(
                $translate.instant('text_calendar'),
                $translate.instant('text_calendar_title'), [
                    $translate.instant('btn_cancel'),
                    $translate.instant('btn_ok')
                ]
            ).then(function(buttonIndex) {
                if (buttonIndex == 2) {
                    var calOptions = window.plugins.calendar.getCalendarOptions();
                    calOptions.firstReminderMinutes = 120 * 24; //120 = 1 hour
                    $cordovaCalendar.createEventWithOptions({
                        title: $scope.event.title,
                        location: $scope.event.address,
                        // notes: 'Bring sandwiches',
                        startDate: new Date($scope.event.start * 1000),
                        endDate: new Date($scope.event.end * 1000),
                        calOptions: calOptions
                    }).then(function(result) {
                        Utils.toast($translate.instant('text_calendar_added'));
                    }, function(err) {
                        Utils.errMessage(err);
                    });
                }
            });
        }

        $scope.recorded = false;
        $scope.onRecord = function() {
            $scope.recorded = true;
        }

        $scope.quest_share = function() {
            if (userService.checkLogin($scope, fb_share)) return;

            function fb_share() {

                facebookConnectPlugin.showDialog({
                    method: "share",
                    caption: "Goodeed+ 好事+",
                    description: $scope.event.title,
                    // picture: $scope.event.picture,
                    // href: "http://www.goodeedplus.com/event/" + $scope.event.event_id
                }, function onShareSuccess(result) {
                    /*
                    Utils.loading();
                    eventService.execute($scope.event.event_id, 'share', $scope.data).then(function(res) {
                        $scope.event.shared = true;
                        $scope.result = res.result;
                        Utils.result($scope);
                        if (!$scope.event.shared) $scope.event.shareCount++;
                    }, function(err) {
                        Utils.hide();
                        if (err != null) Utils.errMessage(err);
                    });*/
                    $scope.result = {
                        message: 'Thanks for sharing this event!',
                        point: 2,
                    };
                    Utils.result($scope);

                });

            }

            // shareDialog.show($scope);

            // eventShare($scope);
        }


    });