angular.module('App')
    .controller('metalCtrl', function($scope, $ionicSlideBoxDelegate, Utils, Badge, User, $translate,
        $ionicScrollDelegate, userService, $window, $ionicPopup, $filter) {
        var iso_height = ionic.Platform.isIOS() ? 20 : 0;
        $scope.height = $window.innerHeight - (33 + 55 + 44 + iso_height); //catagories header + catagories slide + app header

        var statusHolder = {
            loading: [],
            loaded: []
        }
        var _catagories = [{
            icon: 'ion-ios-briefcase',
            text: $translate.instant('cata_organization'), //chinese
            cata: 'organization' //catagory
        }, {
            icon: 'ion-planet',
            text: $translate.instant('cata_general'), //chinese
            cata: 'general' //catagory
        }];

        $scope.catagories = _catagories.concat(Badge.getCatagories());

        function callback() {
            $scope.my_point = User.point();

        }
        userService.signinCallback($scope, callback);


        $scope.badges = [];
        $scope.gain = [];
        $scope.total = [];
        $scope.msg = [];
        $scope.catagories.forEach(function(element) {
            $scope.badges.push([]);
        }, this);

        $scope.onSlideMove = function(data) {
            var index = data.index;
            var cata = $scope.catagories[index].cata;
            if (statusHolder.loading[index] == null) {
                statusHolder.loading[index] = true;

                Badge.getList(cata).then(function(res) {
                    var aquisition = 0;
                    var badge_size = 0;
                    var badges = res.badges;
                    if (badges != null) {
                        badges.forEach(function(element) {
                            if (element.create) aquisition++;
                        }, this);
                        badge_size = badges.length;
                    }

                    $scope.gain[index] = aquisition;
                    $scope.total[index] = badge_size;
                    $scope.badges[index] = badges;
                    $scope.msg[index] = badge_size > 0 ? '' : $translate.instant('error_others');
                    statusHolder.loaded[index] = true;
                }, Utils.errMessage);
            }
        };

        $scope.showMetal = function(metal) {
            var disable_metal = metal.create != null ? '' : '-webkit-filter: grayscale(100%);filter: grayscale(100%);';
            var point = metal.point > 0 ? '<points point="+' + metal.point + '" ></points>' : '';
            $ionicPopup.alert({
                title: metal.name,
                subtitle: $filter('date')(metal.gain * 1000, 'd/M/yyyy'),
                template: '<div class="center" ><img style="border-radius:50%;width:50%;' + disable_metal + '" src="' + metal.picture + '"></div><div class="center">' + metal.content + point + '</div>',
                cssClass: 'popup-dialog',
                okType: 'button-energized'
            });
        }

        $scope.reloadSlide = function() {
            $ionicSlideBoxDelegate.$getByHandle('badgeList').update();
        }


        userService.logoutCallback($scope);
    });




function SimplePubSub() {
    var events = {};
    return {
        on: function(names, handler) {
            names.split(' ').forEach(function(name) {
                if (!events[name]) {
                    events[name] = [];
                }
                events[name].push(handler);
            });

            return this;
        },
        trigger: function(name, args) {
            angular.forEach(events[name], function(handler) {
                handler.call(null, args);
            });
            return this;
        }

    };
};