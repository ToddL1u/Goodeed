angular.module('App')
    .controller('couponCtrl', function ($scope, Coupon, $state, $translate, userService, Utils, $ionicScrollDelegate, $window) {
        var statusHolder = {
            loading: false,
            loaded: false,
            end: false,
            coupons: [],
            page: 1,
            location: {}
        }
        $scope.coupons = [];
        $scope.doRefresh = function () {
            if (!statusHolder.loading) {
                statusHolder.coupons = [];
                statusHolder.page = 1;
                statusHolder.end = false;
                statusHolder.loaded = false;
                $scope.loadMore();
            } else {
                $scope.$broadcast('scroll.refreshComplete');
            }

        }

        $scope.loadMore = function () {
            var sh = statusHolder;
            if (!sh.loading) {
                sh.loading = true;
                // console.log(sh.page);
                // userService.lastLocation == null ||
                /*
                if (!sh.loaded) {
                    userService.getLastLocation().then(function (location) {
                        statusHolder.location = location;
                        load(sh.page, location);
                    }, function (err) {
                        $scope.msg = $translate.instant('error_coupon');
                        statusHolder.end = true;
                        $scope.coupons = [];
                        Utils.errMessage($translate.instant('error_location'));
                    });
                } else {
                    load(sh.page, statusHolder.location);
                }*/
                load(sh.page, statusHolder.location);
            }

        }

        function load(page, location) {
            Coupon.getList(page, location).then(function (res) {
                statusHolder.page = page + 1;
                $scope.msg = '';
                var coupons = (res.coupons == null) ? [] : res.coupons;
                statusHolder.coupons = statusHolder.coupons.concat(coupons);
                $scope.coupons = statusHolder.coupons;
                if (coupons.length < 30) statusHolder.end = true;
                if (statusHolder.coupons.length < 1) {
                    $scope.msg = $translate.instant('error_coupon');
                }else{
                    $scope.msg ='';
                }
                statusHolder.loaded = true;
                statusHolder.loading = false;
                $scope.$broadcast('scroll.refreshComplete');
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, function (err) {
                $scope.msg = $translate.instant('error_coupon');
                statusHolder.end = true;
            });
        }

        $scope.hasMore = function () {
            return !statusHolder.end;
        }

        $scope.mapview = function () {
            if (statusHolder.loaded & $scope.coupons.length > 0) $state.go('app.mapview', { coupons: JSON.stringify(statusHolder.coupons) });
        }

        $scope.showUp = false;
        $scope.getScrollPosistion = function () {
            $scope.$apply(function () {
                var top = $ionicScrollDelegate.$getByHandle('couponList').getScrollPosition().top;
                // console.log(top);
                $scope.showUp = top > $window.innerHeight - 161;
            });
        }

        $scope.scrollToUp = function () {
            $ionicScrollDelegate.$getByHandle('couponList').scrollTop(true);
        }

        
    });
