angular.module('App')
    .service('tutorialModal', function ($rootScope, $ionicSlideBoxDelegate, modalService, Application) {
        var init = function ($scope) {
            ionic.Platform.showStatusBar(false);
            var promise = modalService.init('views/tutorial/tutorial.html', $scope)
                .then(function (modal) {
                    // modal.show();
                    $scope.openModal();
                    Application.setInitialRun(false);
                });

            
            var images = [];
            $scope.lastPage = false;
            for (var index = 1; index <= 5; index++) {
                images.push('img/tutorial/0' + index + '.png');
            }
            $scope.pages = images;

            $scope.checkPage = function (index) {
                var slide_total = $ionicSlideBoxDelegate.$getByHandle('tutorial').slidesCount();
                if (index == slide_total - 1) {
                    $scope.lastPage = true;
                } else {
                    $scope.lastPage = false;
                }
            }

            $scope.next = function () {
                $ionicSlideBoxDelegate.next(1000);
            }
            $scope.done = function(){
                $scope.closeModal();
                ionic.Platform.showStatusBar(true);
            }
            return promise;
        }

        return init;
    });