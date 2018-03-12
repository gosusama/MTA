define(['angular'], function (angular) {
    var app = angular.module('common-filter', []);
    app.filter('displayBool', function () {
        return function(input) {
            if (input === 1) {
                return "<i class='glyphicon glyphicon-ok text-success'></i>";
            }
        }
    });

    app.filter('status', function () {
        return function (input) {
            if (input === 'A') {
                return "Sử dụng";
            }
            return "Không sử dụng";
        }
    });
    return app;
});