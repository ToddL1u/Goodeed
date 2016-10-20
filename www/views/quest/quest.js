angular.module('App')
    .controller('questCtrl', function($scope, $ionicPopup, modalService, $translate, Badge,
        Quest, Utils, userService) {
        var statusHolder = {
            loaded: false,
            loading: false,
            quests: [],
            page: 1,
            end: false
        }

        function load() {
            if (!statusHolder.loading) {
                statusHolder.loading = true;
                Quest.getList(statusHolder.page).then(function(res) {
                    statusHolder.page++;
                    statusHolder.quests = (res.quests == null) ? [] : res.quests;
                    $scope.quests = statusHolder.quests;
                    if (statusHolder.quests.length == 0) {
                        $scope.msg = $translate.instant('empty_quest');
                    } else {
                        $scope.msg = '';
                    }
                    // if (res.quests < 30)statusHolder.end = true;
                    statusHolder.loaded = true;
                    statusHolder.loading = false;
                    $scope.$broadcast('scroll.refreshComplete');
                }, function(err) {
                    $scope.msg = $translate.instant('empty_quest');
                    Utils.errMessage(err);
                });
            }
        }
        load();

        $scope.doRefresh = function() {
            if (statusHolder.loaded) {
                load();
            } else {
                $scope.$broadcast('scroll.refreshComplete');
            }
        }

        $scope.showQuest = function(quest) {
            var on_submit = false;
            if (userService.checkLogin($scope)) return;
            $scope.gm = userService.gm;
            $scope.data = {};
            $scope.quest = quest;
            $scope.quest.icon = Badge.getCatagoriesIcon($scope.quest.cata);
            $ionicPopup.show({
                title: quest.title,
                templateUrl: 'views/directives/quest-dialog.html',
                scope: $scope,
                cssClass: 'popup-dialog',
                buttons: [{
                    text: $translate.instant('btn_cancel')
                }, {
                    text: $translate.instant('btn_go'),
                    type: 'button-energized',
                    onTap: function(e) {

                        switch (quest.type) {
                            case 'T': //q&a
                                var ans = $scope.data.ans.toLowerCase();
                                if (ans == null) {
                                    e.preventDefault();
                                    return;
                                } else {
                                    execute(ans);
                                }
                                break;
                            case 'O': //options
                                var ans = quest.options.indexOf($scope.data.options) + 1;
                                if ($scope.data.options == null) {
                                    e.preventDefault();
                                    return;
                                } else {
                                    if ($scope.data.ans == ans) {
                                        $scope.result = {
                                            message: 'The answer is correct!',
                                            point: 1
                                        }
                                    } else {
                                        $scope.result = {
                                            message: $translate.instant('quest_wrong')
                                        }
                                    }

                                    Utils.result($scope);
                                    removeQuest(quest);
                                }
                                break;
                            default: //checkin
                                // execute('');
                                $scope.result = {
                                    message: 'Thanks for making this world better! :)',
                                    point:1
                                }
                                Utils.result($scope);
                                removeQuest(quest);
                                break;
                        }

                        function execute(ans) {
                            if (on_submit) return;
                            on_submit = true;
                            Utils.loading();
                            removeQuest(quest);
                            Quest.execute(quest.quest_id, ans).then(function(res) {
                                $scope.result = res.result;
                                Utils.result($scope);
                            }, function(err) {
                                Utils.hide();
                                Utils.errMessage($translate.instant(err));
                            });
                        }
                    }
                }]
            });
        }

        function removeQuest(quest) {
            var quests = $scope.quests;
            quests.splice(quests.indexOf(quest), 1);
        }

        // quest filter
        $scope.catagories = Badge.getCatagories();
        $scope.filter = function() {
            modalService.init('views/quest-filter/quest-filter.html', $scope)
                .then(function(modal) {
                    $scope.openModal();
                });
            // questFilter($scope);
        };

        var temp_filter = [];
        $scope._temp_filter = [];

        $scope.catagories.forEach(function(element) {
            var cata = element.cata;
            temp_filter[cata] = true;
            $scope._temp_filter[cata] = true;
        }, this);


        $scope.update = function() {
            userService.code_encrypt();
            var setting_off_count = 0;
            for (var k in $scope._temp_filter) {
                if (temp_filter[k]) setting_off_count++;
                // if (setting_off_count >= 5) {
                //     Utils.alertshow('at least pick one', 'Wrong setting');
                //     return;
                // }
            }
            for (var k in $scope._temp_filter) {
                temp_filter[k] = $scope._temp_filter[k];
            }
            $scope.closeModal();
        }

        $scope.cancel = function() {
            for (var k in temp_filter) {
                $scope._temp_filter[k] = temp_filter[k];
            }
            $scope.closeModal();
        }

        $scope.reset_filter = function() {
            userService.code_decrypt();
            for (var k in $scope._temp_filter) {
                $scope._temp_filter[k] = true;
            }
        }

        $scope.quest_filter = function(cata) {
            return temp_filter[cata];
        }

    });