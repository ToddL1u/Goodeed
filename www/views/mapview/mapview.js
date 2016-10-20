angular.module('App')
    .controller('mapviewCtrl', function ($scope, userService, Coupon, $stateParams) {
        var coupons = JSON.parse($stateParams.coupons);
        console.log(coupons);
        var statusHolder = {
            loading: false,
            coupons: []
        }
        var last_location  = userService.lastLocation();
        var center = { latitude: last_location.lat, longitude: last_location.lng };
        if (coupons.length == 1) {
            coupons.forEach(function (ele) {
                setCoupon(ele);
            }, this);
        }

        function setCoupon(coupon) {
            $scope.coupon = coupon;
            coupon.map = true;
            center.latitude = coupon.lat;
            center.longitude = coupon.lng;
        }

        $scope.map = {
            center: center,
            event: {
                drag: function (maps, eventName, args) {
                    $scope.coupon = null;
                },
                dragend: function (maps, eventName, args) {
                    var location = {
                        lat: maps.getCenter().lat(),
                        lng: maps.getCenter().lng()
                    }
                    if (!statusHolder.loading) {
                        statusHolder.loading = true;
                        Coupon.getList(1, location).then(function (res) {
                            statusHolder.coupons = res.coupons;
                            statusHolder.loading = false;
                        });
                    }

                },
            },
            zoom: 16,
            bounds: {}
        };

        $scope.options = {
            scrollwheel: false
        };

        $scope.setCurrent = function () {
            $scope.map.center = { latitude: last_location.lat, longitude: last_location.lng };
            // $scope.map.zoom = 13;
        }

        $scope.couponMarkers = [];
        var createCouponMarker = function (coupon, idKey) {
            if (idKey == null) {
                idKey = "id";
            }
            var ret = {
                latitude: coupon.lat,
                longitude: coupon.lng,
                coupon: coupon,
                click: function () {
                    console.log(coupon);
                    setCoupon(coupon);
                }
            }
            ret[idKey] = coupon.coupon_id;
            return ret;
        }

        var createRandomMarker = function (i, bounds, idKey) {
            var lat_min = bounds.southwest.latitude,
                lat_range = bounds.northeast.latitude - lat_min,
                lng_min = bounds.southwest.longitude,
                lng_range = bounds.northeast.longitude - lng_min;

            if (idKey == null) {
                idKey = "id";
            }

            var latitude = lat_min + (Math.random() * lat_range);
            var longitude = lng_min + (Math.random() * lng_range);
            var ret = {
                latitude: latitude,
                longitude: longitude,
                title: 'm' + i,
                click: function () {

                }
            };
            ret[idKey] = i;
            return ret;
        };
        $scope.randomMarkers = [];
        // Get the bounds from the map once it's loaded
        $scope.$watch(function () {
            return $scope.map.bounds;
        }, function (nv, ov) {
            var map = $scope.map;
            var location = {
                lat: map.center.latitude,
                lng: map.center.longitude,
                lat_min: map.bounds.southwest.latitude,
                lat_max: map.bounds.northeast.latitude,
                lng_min: map.bounds.southwest.longitude,
                lng_max: map.bounds.northeast.longitude,
            }

            if (!statusHolder.loading) {
                statusHolder.loading = true;
                Coupon.getList(1, location).then(function (res) {
                    statusHolder.coupons = res.coupons;
                    statusHolder.loading = false;
                    var markers = [];
                    statusHolder.coupons.forEach(function (coupon) {
                        markers.push(createCouponMarker(coupon));
                    }, this);
                    $scope.couponMarkers = markers;
                    
                });
            }
            // Only need to regenerate once
            // if (!ov.southwest && nv.southwest) {

            // }
        }, true);

    });