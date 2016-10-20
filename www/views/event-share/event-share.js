angular.module('App')
    .service('eventShare', function ($ionicActionSheet, $translate, $cordovaCapture,
        $cordovaCamera, modalService, userService, eventService, Utils) {
        // setting modal
        function init($scope) {
            $scope.share = {
                video: {
                    name: '',
                    size: 0
                },
                message: 'test'
            }

            $scope.questShare = function () {
                if (userService.checkLogin($scope)) return;
                if ($scope.share.video.size == 0 & $scope.share.message == '') return;
                $scope.closeModal();
                Utils.loading();
                
                eventService.execute($scope.event.event_id, 'share', $scope.share).then(function (res) {
                    $scope.result = res.result;
                    Utils.result($scope);
                    $scope.event.shareCount++;
                }, function (err) {
                    Utils.hide();
                    if(err!=null)Utils.errMessage(err);
                });
            }
            $scope.chooseVideo = function () {
                $ionicActionSheet.show({
                    buttons: [
                        { text: $translate.instant('text_video_camera') },
                        { text: $translate.instant('text_gallery') }
                    ],
                    cancelText: $translate.instant('btn_cancel'),
                    titleText: 'Take a video or take one from your phone',
                    buttonClicked: function (index) {
                        var options = {
                            quality: 50,
                            destinationType: Camera.DestinationType.DATA_URL,
                            popoverOptions: CameraPopoverOptions,
                            saveToPhotoAlbum: false,
                            correctOrientation: true
                        };
                        switch (index) {
                            case 0:
                                //aler duration
                                var options = { limit: 1, duration: 15 };
                                $cordovaCapture.captureVideo(options).then(function (videoData) {
                                    var video = videoData[0];
                                    setVideo(video.fullPath);
                                    $scope.share.video.name = video.name;
                                    $scope.share.video.size = video.size;
                                }, function (err) {
                                    // An error occurred. Show a message to the user
                                });
                                break;
                            case 1:
                                var options = {
                                    mediaType: Camera.MediaType.VIDEO,
                                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY
                                };

                                $cordovaCamera.getPicture(options).then(function (videoUrl) {
                                    setVideo(videoUrl);
                                });
                                break;
                            default:
                                break;
                        }

                        function setVideo(video) {
                            // share.video;
                            var v = '<video id="popcornVideo" controls="controls" style="width:100%;height:auto;">';
                            v += "<source src='" + video + "' type='video/mp4'>";
                            v += "</video>";
                            document.querySelector("#videoArea").innerHTML = v;
                            // var video = Popucorn('#popcornVideo');
                            // video.listen("canplayall", function () {
                            //     this.currentTime(1).capture();
                            // });
                        }
                        return true;
                    }
                });
            }

            modalService.init('views/event-share/event-share.html', $scope)
                .then(function (modal) {
                    // modal.show();
                    $scope.openModal();
                });
        }
        return init;
    });