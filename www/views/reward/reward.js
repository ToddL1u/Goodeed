angular.module('App')
    .controller('rewardCtrl', function($scope, $translate, $filter, $ionicPopup, Reward,
        scratchCard, scratchWon, userService, Utils, $cordovaDialogs) {
        var statusHolder = {
            loading: false,
            loaded: false,
            rewards: [],
            unsycReward: []
        }

        $scope.doRefresh = function() {
            $scope.msg = '';
            load();
            $scope.$broadcast('scroll.refreshComplete');
        }

        function load() {
            if (!statusHolder.loading) {
                statusHolder.unsycReward = [];
                statusHolder.loading = true;
                Reward.getList().then(function(res) {
                    statusHolder.rewards = res.rewards;
                    $scope.rewards = res.rewards;
                    statusHolder.loading = false;
                    statusHolder.loaded = true;
                    rewardList();
                }, Utils.errMessage);
            }
        }
        load();

        $scope.showReward = function(reward) {
            $ionicPopup.show({
                title: reward.name,
                subTitle: $translate.instant('text_expiration') + $filter('date')(reward.exp * 1000, 'y-MM-d, h:mm:ss'),
                template: reward.content,
                scope: $scope,
                cssClass: 'popup-dialog',
                buttons: [{
                        text: $translate.instant('btn_cancel')
                    },
                    {
                        text: $translate.instant('btn_redeem'),
                        type: 'button-energized',
                        onTap: function(e) {
                            var user = userService.user;
                            var now = new Date();
                            var info = user.name + ',' + reward.sn + ',' + now.getMonth() + '/' + now.getDate();
                            $cordovaDialogs.confirm('',
                                $translate.instant('text_reward_comfirm'), [
                                    $translate.instant('btn_cancel'),
                                    $translate.instant('btn_ok')
                                ]
                            ).then(function(buttonIndex) {
                                if (buttonIndex == 2) {
                                    Reward.redeem(reward.reward_id).then(function(res) {
                                        $ionicPopup.alert({
                                            template: '<div class="center">' +
                                                '<img src="https://chart.googleapis.com/chart?cht=qr&chs=177x177&choe=UTF-8&chl=' + info + '"><br>' +
                                                $translate.instant('text_sn') + reward.sn +
                                                '</div>',
                                            okType: 'button-energized',
                                            cssClass: 'popup-dialog',
                                        });
                                        removeReward(reward);
                                    });
                                    F
                                }
                            });


                        }
                    }
                ]
            });
        }

        function removeReward(reward) {
            var rewards = $scope.rewards;
            rewards.splice(rewards.indexOf(reward), 1);
            rewardList();
        }

        function rewardList() {
            if ($scope.rewards == null || $scope.rewards.length == 0) {
                $scope.msg = $translate.instant('empty_reward');
            } else {
                $scope.msg = '';
            }
        }

        $scope.scratch = function() {
            /*
            if (statusHolder.unsycReward.length == 0) {
                Utils.loading();
                Reward.checkReward().then(function (res) {
                    Utils.hide();
                    if (res.rewards == null) {
                        Utils.alertshow($translate.instant('scratch_title'), $translate.instant(res.data.msg));
                    } else {
                        statusHolder.unsycReward = res.rewards;
                        $scope.unsycReward = statusHolder.unsycReward;
                        scratchCard($scope);
                    }
                }, function (err) {
                    Utils.hide();
                    Utils.errMessage(err);
                })
            } else {
                $scope.unsycReward = statusHolder.unsycReward;
                scratchCard($scope);
            }*/
            statusHolder.unsycReward = [];
            scratchCard($scope);
        }

        $scope.mergeRewards = function(rewards) {
            if (statusHolder.unsycReward.length > 0) {
                scratchWon();
                $scope.rewards = statusHolder.unsycReward.concat(statusHolder.rewards);
                rewardList();
            } else {
                $ionicPopup.alert({
                    template: '<div class="center">' + $translate.instant('scratch_lose') + '</div>',
                    cssClass: 'popup-dialog',
                    okType: 'button-energized'
                });
            }
            statusHolder.unsycReward = [];
        }

        userService.logoutCallback($scope);
    });