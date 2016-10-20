angular.module('App')
    .service('profileEditModal', function (modalService, User, Utils) {
        var init = function ($scope) {

            var promise = modalService.init('views/profile-edit/profile-edit.html', $scope)
                .then(function (modal) {
                    // modal.show();
                    $scope.openModal();
                });

            // Form data for the login modal
            $scope.userData = {};
            angular.forEach($scope.user, function (value, key) {
                $scope.userData[key] = value;
            }, []);

            $scope.update = function () {
                Utils.loading();
                User.update($scope.userData).then(function (res) {
                    Utils.hide();
                    $scope.closeModal();
                },function(err){
                    Utils.hide();
                    Utils.errMessage(JSON.stringify(err));
                });
            }

            return promise;
        }

        return {
            init: init
        }
    });