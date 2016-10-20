angular.module('App')
    .controller('menuCtrl', function ($scope, $state, $translate, userService, settingModal, tutorialModal,
        $ionicHistory, User, $ionicSideMenuDelegate, Application, $cordovaAppVersion) {

        $scope.appPages = [
            { title: 'menu_event', icon: 'ion-android-compass', url: '#/app/explore', action: "openPage('app.explore')" },
            { title: 'menu_coupon', icon: 'ion-menu-coupon', url: '#/app/coupon', action: "openPage('app.coupon')" },
            { title: 'menu_quest', icon: 'ion-question', url: '#/app/quest', action: "openPage('app.quest')" },
            { title: 'menu_metal', icon: 'ion-ribbon-a', url: '#/app/quest', action: "openPage('app.metal',true)" },
            { title: 'menu_reward', icon: 'ion-gift', url: '#/app/quest', action: "openPage('app.reward',true)" },
            { title: 'menu_setting', icon: 'ion-cogs', url: '#/app/quest', action: "setting()" }
        ];

        $scope.login = User.hasLogin();
        $scope.$watch(User.hasLogin, function () {
            $scope.login = User.hasLogin();
        });

        $scope.user = User.getUser();
        $scope.$watch(User.getUser, function () {
            $scope.user = User.getUser();
        }, true);

        $scope.signIn = function () {
            userService.checkLogin($scope);
        };

        $scope.openPage = function (page, loginRequire) {
            if (loginRequire) {
                userService.checkLogin($scope, redirect);
                function redirect() {
                    if (User.hasLogin()) {
                        $ionicHistory.nextViewOptions({
                            historyRoot: true,
                            disableAnimate: true
                        });
                        $state.go(page);
                        $ionicSideMenuDelegate.toggleLeft(false);
                    }
                }
            } else {
                $ionicHistory.nextViewOptions({
                    historyRoot: true,
                    disableAnimate: true
                });
                $state.go(page);
                $ionicSideMenuDelegate.toggleLeft(false);
            }
        }

        $scope.profile = function () {
            $ionicHistory.nextViewOptions({
                historyRoot: true,
                disableAnimate: true
            });
            $state.go('app.profile');
        }

        $scope.setting = function () {
            settingModal($scope);
        };

        ionic.Platform.ready(function () {
            if (Application.isInitialRun()) tutorialModal($scope);
            document.addEventListener("pause", function () {
                $ionicSideMenuDelegate.toggleLeft(false);
            }, false);

            if (ionic.Platform.isWebView()) {
                navigator.globalization.getPreferredLanguage(
                    function (language) {
                        if(language.value.startsWith('zh')){
                            $translate.use('zh-TW');
                        }else{
                            $translate.use(language.value);
                        }
                    }, function () {
                        console.log('fail');
                    }
                );
            }
            // $cordovaAppVersion.getVersionNumber().then(function (version) {
            //     var appVersion = version;
            // });
        });
    });
