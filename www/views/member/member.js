angular.module('App')
    .service('memberModal', function (modalService, $rootScope, User, Utils, $ionicPopup,
        $ionicActionSheet, $cordovaCamera, userService, $translate) {
        var init = function () {
            $scope = $rootScope.$new();
            var promise = modalService.init('views/member/member.html', $scope)
                .then(function (modal) {
                    // modal.show();
                    $scope.openModal();
                });

            // Form data for the login modal
            $scope.userData = {
            };

            // Perform the login action when the user submits the login form
            $scope.applyMember = function () {
                var ud = $scope.userData;
                if (ud.o_id == null || ud.badge == null || (ud.o_id ==0 & (ud.org == null || ud.org.trim().length == 0))) {
                    Utils.toast($translate.instant('error_member'));
                    return;
                }
                $scope.disable = true;
                Utils.loading();
                User.memberApply(ud).then(function (res) {
                    Utils.toast(res.data.msg,'long');
                    dismissModal();
                }, function (err) {
                    dismissModal();
                    Utils.errMessage(err);
                });
            };

            function dismissModal() {
                $scope.closeModal();
                Utils.hide();
            }

            $scope.membeBadge = function () {
                $ionicActionSheet.show({
                    buttons: [
                        { text: $translate.instant('text_photo_camera') },
                        { text: $translate.instant('text_gallery') }
                    ],
                    cancelText: $translate.instant('btn_cancel'),
                    buttonClicked: function (index) {
                        var options = {
                            quality: 50,
                            destinationType: Camera.DestinationType.DATA_URL,
                            allowEdit: false,
                            encodingType: Camera.EncodingType.PNG,
                            targetWidth: 300,
                            targetHeight: 250,
                            popoverOptions: CameraPopoverOptions,
                            saveToPhotoAlbum: false,
                            correctOrientation: true
                        };
                        switch (index) {
                            case 0:
                                options.sourceType = Camera.PictureSourceType.CAMERA;
                                break;
                            case 1:
                                options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
                                break;
                            default:
                                break;
                        }
                        $cordovaCamera.getPicture(options).then(function (imageData) {
                            $scope.userData.badge = imageData;
                            $scope.badge = "data:image/jpeg;base64," + imageData;
                        }, function (err) {
                            // error
                        });

                        return true;
                    }
                });
            }

            $scope.chooseOrg = function () {
                $scope.organizations = userService.getOrganizations();

                $scope.data = {};
                $ionicPopup.show({
                    template: '<ion-list>' +
                    '<ion-radio ng-model="data.choice" ng-repeat="og in organizations " ng-value="og">{{og.name}}</ion-radio>' +
                    '</ion-list>',
                    scope: $scope,
                    cssClass: 'popup-dialog-no-head',
                    buttons: [
                        { text: $translate.instant('btn_cancel') },
                        {
                            text: $translate.instant('btn_ok'),
                            type: 'button-positive',
                            onTap: function (e) {
                                if (!$scope.data.choice) {
                                    //don't allow the user to close unless he enters wifi password
                                    e.preventDefault();
                                } else {
                                    $scope.org = $scope.data.choice;
                                    $scope.userData.o_id = $scope.data.choice.o_id;
                                }

                            }
                        }
                    ]
                });
            }

            return promise;
        }

        return {
            init: init
        }
    });