angular.module('App')
    .service('settingModal', function ($translate, $state, $ionicHistory, 
        tutorialModal, modalService, User, Utils, memberModal, Application, $ionicSideMenuDelegate) {
        // setting modal
        function show($scope) {
            $scope.facebook = function () {
                User.fb_update().then(function (res) {

                }, function (err) {
                    $scope.fb = false;
                    Utils.errMessage(err);
                });
            }
            $scope.rating = function () {
                if (ionic.Platform.isAndroid()) {
                    window.open('market://details?id=com.goodeedplus.goodeedplus', '_system');
                } else {
                    window.open('itms-apps://itunes.apple.com/app/com.goodeedplus.goodeedplus/id', '_system');
                }

            }

            

            function rateApp() {
                AppRate.preferences = {
                    openStoreInApp: true,
                    displayAppName: 'My custom app title',
                    usesUntilPrompt: 5,
                    promptAgainForEachNewVersion: false,
                    storeAppURL: {
                        ios: 'com.goodeedplus.goodeedplus',
                        android: 'market://details?id=com.goodeedplus.goodeedplus',
                        // windows: 'ms-windows-store://pdp/?ProductId=<the apps Store ID>',
                        // blackberry: 'appworld://content/[App Id]/',
                        // windows8: 'ms-windows-store:Review?name=<the Package Family Name of the application>'
                    },
                    customLocale: {
                        title: "Rate %@",
                        message: "If you enjoy using %@, would you mind taking a moment to rate it? It won't take more than a minute. Thanks for your support!",
                        cancelButtonLabel: "No, Thanks",
                        laterButtonLabel: "Remind Me Later",
                        rateButtonLabel: "Rate It Now"
                    }
                };

                AppRate.promptForRating();
            }
            $scope.tutorial = function () {
                $scope.closeModal();
                tutorialModal($scope);
            }
            $scope.contact = function () {
                // $scope.closeModal();
                var email = {
                    to: 'max@mustermann.de',
                    cc: 'erika@mustermann.de',
                    bcc: ['john@doe.com', 'jane@doe.com'],
                    subject: 'Cordova Icons',
                    body: 'How are you? Nice greetings from Leipzig',
                    isHtml: true
                };

                $cordovaEmailComposer.open(email).then(function (res) {
                    console.log('here');
                }, function (err) {
                    console.log(err);
                    // user cancelled email
                });
            }
            $scope.member = function () {
                memberModal.init();
            }
            $scope.showWebView = function (button) {
                $scope.closeModal();
                var link = 'http://www.goodeedplus.com/mobile/';
                switch (button) {
                    case 'term':
                        link += 'term';
                        break;
                    case 'help':

                        break;
                    default:
                        break;
                }
                $ionicHistory.nextViewOptions({
                    historyRoot: true,
                    disableAnimate: true
                });
                $state.go('app.webview', { url: link });
                $ionicSideMenuDelegate.toggleLeft(false);
            }

            $scope.signout = function () {
                Utils.loading();
                User.logout().then(function (res) {
                    $scope.closeModal();
                    Utils.hide();
                }, function (err) {
                    $scope.closeModal();
                    Utils.hide();
                });

            }

            $scope.fb_fans = function () {
                window.open('fb://profile/423580797665018', '_system');
            }

            $scope.settingList = [
                {
                    divider: $translate.instant('setting_title_about'),
                    items: [
                        {
                            text: $translate.instant('setting_about'),
                            action: 'tutorial()',

                        }, {
                            text: $translate.instant('setting_rating'),
                            action: 'rating()',

                        }, {
                            text: $translate.instant('setting_fans'),
                            action: 'fb_fans()',
                        }]
                }, {
                    divider: $translate.instant('setting_title_legal'),
                    items: [
                        {
                            text: $translate.instant('setting_term'),
                            action: "showWebView('term')"
                        }]
                }
            ];

            if (User.hasLogin()) {
                $scope.fb = User.getUser().fb_tk ? true : false;
                if (!$scope.fb) {
                    $scope.settingList.push({
                        divider: $translate.instant('setting_title_connect'),
                        items: [{
                            text: 'Facebook',
                            action: 'facebook()',
                            // type: 'checkbox',
                            // checked: $scope.fb
                        }]
                    });
                }
                $scope.settingList = $scope.settingList.concat({
                    divider: '',
                    items: [
                        {
                            text: $translate.instant('setting_member_apply'),
                            action: 'member()'
                        }, {
                            text: $translate.instant('setting_signout'),
                            action: 'signout()'
                        }]
                });

            }



            modalService.init('views/setting/setting.html', $scope)
                .then(function (modal) {
                    // modal.show();
                    $scope.openModal();
                });
        }
        return show;
    });