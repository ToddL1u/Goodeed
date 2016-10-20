angular.module('App')
    .service('questFilter', function (modalService) {


        var filter = function (scope) {
            modalService.init('views/quest-filter/quest-filter.html', scope)
                .then(function (modal) {
                    scope.openModal();
                });
            var temp_filter = [];
            scope._temp_filter = [];

            scope.catagories.forEach(function (element) {
                var cata = element.cata;
                temp_filter[cata] = true;
                scope._temp_filter[cata] = true;
            }, this);



            scope.update = function () {
                for (var k in scope._temp_filter) {
                    temp_filter[k] = scope._temp_filter[k];
                }
                scope.closeModal();
            }

            scope.cancel = function () {
                for (var k in temp_filter) {
                    scope._temp_filter[k] = temp_filter[k];
                }
                scope.closeModal();
            }
            scope.reset_filter = function () {
                for (var k in scope._temp_filter) {
                    scope._temp_filter[k] = true;
                }
            }
        }
        return filter;
    });