angular.module('App')
    .controller('webCtrl', function($scope, $sce, $stateParams, $window) {
        $scope.url = $sce.trustAsResourceUrl($stateParams.url);
        $scope.frame_height = $window.innerHeight;
    });