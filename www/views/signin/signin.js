angular.module('App')
    .service('signinModal', function(modalService, $rootScope, User, Utils, $ionicPopup, $translate) {
        var init = function($scope) {
            $scope = $rootScope.$new();
            var promise = modalService.init('views/signin/signin.html', $scope)
                .then(function(modal) {
                    // modal.show();
                    $scope.openModal();
                });

            // Form data for the login modal
            $scope.userData = {
                // email: 'zivhsiao@gmail.com',
                // pwd: 'hezrid5',
                // name: 'Todd'
            };

            $scope.type = "password";
            $scope.pwdType = function(type) {
                $scope.type = type;
            }
            $scope.selectedIndex = 0;
            $scope.disable = true;
            $scope.buttonClicked = function(index) {
                $scope.selectedIndex = index;
                if ($scope.selectedIndex == 1 & !$scope.disable) $scope.disable = ($scope.userData.name == null);
                $scope.$apply();
            }

            $scope.$watch('userData', function() {
                $scope.disable = ($scope.userData.email == null || $scope.userData.pwd == null);
                if ($scope.selectedIndex == 1 & !$scope.disable) $scope.disable = ($scope.userData.name == null);
            }, true);

            // Perform the login action when the user submits the login form
            $scope.doSignIn = function() {
                $scope.disable = true;
                Utils.loading();
                if ($scope.selectedIndex == 0) {
                    User.login($scope.userData).then(function(res) {
                        dismissModal();
                    }, function(err) {
                        Utils.hide();
                        Utils.errMessage(err);
                    });
                } else {
                    User.signUp($scope.userData).then(function(res) {
                        dismissModal();
                    }, function(err) {
                        Utils.hide();
                        Utils.errMessage(err);
                    });
                }
            };

            function dismissModal() {
                $scope.closeModal();
                Utils.hide();
            }

            $scope.facebook = function() {
                Utils.loading();
                User.oauth().then(function(res) {
                    dismissModal();
                }, function(err) {
                    Utils.errMessage(err);
                    Utils.hide();
                });
            }

            $scope.resetPwd = function() {
                $scope.data = {};
                $ionicPopup.show({
                    title: 'Password Check',
                    template: '<input type="email" ng-model="data.email">',
                    cssClass: 'popup-dialog',
                    scope: $scope,
                    buttons: [{
                            text: $translate.instant('btn_cancel')
                        }, {
                            text: $translate.instant('btn_ok'),
                            type: 'button-energized',
                            onTap: function(e) {
                                var email = $scope.data.email;
                                console.log(email);
                                if (email == null) {
                                    e.preventDefault();
                                } else {
                                    User.resetPwd(email).then(null, Utils.errMessage);
                                }
                            }
                        }]
                        // inputPlaceholder: 'Your password'
                });
            }

            return promise;
        }

        return {
            init: init
        }
    });