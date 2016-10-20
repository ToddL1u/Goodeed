// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('App', ['ionic', 'strings', 'jett.ionic.filter.bar', 'jett.ionic.scroll.sista',
    'ti-segmented-control', 'ngCordova', 'ngResource', 'ngStorage', 'ngCordovaOauth', 'ionic.closePopup',
    'uiGmapgoogle-maps'])

    .run(function ($ionicPlatform, $window, User, $cordovaAppVersion, userService) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
            // if (window.cordova.platformId == "browser") {
            //     facebookConnectPlugin.browserInit('815355371933870');
            // version is optional. It refers to the version of API you may want to use.
            // success is optional. It calls the function when the SDK has been inited
            // }
            userService.baseSetting();
            userService.signIn();
            userService.setLocalNotification();
            $cordovaAppVersion.getVersionNumber().then(function (version) {
                var appVersion = version;
                console.log(version);
            });
        });


    })

    .config(function ($stateProvider, $urlRouterProvider, $ionicFilterBarConfigProvider, uiGmapGoogleMapApiProvider) {
        
        uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyBH6cju_eGouxEVaZP6h76mjyWlmSN9iKQ',
            v: '3.20', //defaults to latest 3.X anyhow
            libraries: 'weather,geometry,visualization'
        });

        $stateProvider
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'views/menu/menu.html',
                controller: 'menuCtrl'
            })

            .state('app.explore', {
                url: '/explore',
                views: {
                    'menuContent': {
                        templateUrl: 'views/explore/explore.html',
                        controller: 'exploreCtrl'
                    }
                }
            })
            .state('app.coupon', {
                url: '/coupon',
                views: {
                    'menuContent': {
                        templateUrl: 'views/coupon/coupon.html',
                        controller: 'couponCtrl'
                    }
                }
            })

            .state('app.quest', {
                url: '/quest',
                views: {
                    'menuContent': {
                        templateUrl: 'views/quest/quest.html',
                        controller: 'questCtrl'
                    }
                }
            })

            .state('app.metal', {
                url: '/metal',
                views: {
                    'menuContent': {
                        templateUrl: 'views/metal/metal.html',
                        controller: 'metalCtrl'
                    }
                }
            })

            .state('app.reward', {
                url: '/reward',
                views: {
                    'menuContent': {
                        templateUrl: 'views/reward/reward.html',
                        controller: 'rewardCtrl'
                    }
                }
            })
            .state('app.profile', {
                url: '/profile',
                views: {
                    'menuContent': {
                        templateUrl: 'views/profile/profile.html',
                        controller: 'profileCtrl'
                    }
                }
            })

            .state('app.event', {
                url: '/event/:event',
                params: { event: null },
                views: {
                    'menuContent': {
                        templateUrl: 'views/event/event.html',
                        controller: 'eventCtrl'
                    }
                }

            })
            .state('app.eventFilterList', {
                url: '/eventFilterList',
                views: {
                    'menuContent': {
                        templateUrl: 'views/event-filter-list/event-filter-list.html',
                        controller: 'listCtrl'
                    }
                }
            })
            .state('app.webview', {
                url: '/webview/:url',
                views: {
                    'menuContent': {
                        templateUrl: 'views/webview/webview.html',
                        controller: 'webCtrl'
                    }
                }
            })
            .state('app.setting', {
                url: '/setting',
                views: {
                    'menuContent': {
                        templateUrl: 'views/setting/setting.html',
                        controller: 'settingCtrl'
                    }
                }
            })
            .state('app.mapview', {
                url: '/mapview/:coupons',
                views: {
                    'menuContent': {
                        templateUrl: 'views/mapview/mapview.html',
                        controller: 'mapviewCtrl'
                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/explore');
        $ionicFilterBarConfigProvider.theme('stable');
        // $ionicFilterBarConfigProvider.clear('ion-close');
        // $ionicFilterBarConfigProvider.search('ion-search');
        // $ionicFilterBarConfigProvider.backdrop(true);
        // $ionicFilterBarConfigProvider.transition('vertical');
        // $ionicFilterBarConfigProvider.placeholder('Filter');

    })
    .filter('distance', function ($translate) {
        return function (input) {
            if (input >= 1000) {
                return (input / 1000).toFixed(1) + $translate.instant('unit_kilo');
            } else {
                return input + $translate.instant('unit_meter');
            }
        }
    })
    .filter('count', function () {
        return function (input) {
            if (input >= 1000000) {
                return (input / 1000000).toFixed(1) + 'm';
            } else if (input >= 1000) {
                return (input / 1000).toFixed(1) + 'k';
            }

            return input;

        }
    })
    .filter('htmlToPlaintext', function () {
        return function (text) {
            return text ? String(text).replace(/<[^>]+>/gm, '')
            .replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&gt;/g, "&")
            .replace(/&#39;/g, "\'").replace(/&quot;/g, "\"").replace(/<br>/g, "\n") : '';
        };
    }
    );;
