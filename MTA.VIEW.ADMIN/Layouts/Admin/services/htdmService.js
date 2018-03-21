define(['angular'], function (angular) {
    var app = angular.module('htdmModule', []);
    app.service('htdmService', ['configService','$resource',function(configService,$resource) {
        var result = {
            config: configService
        };
        result.buildUrl = function (module, action) {
            return configService.rootUrlWeb + '/Layouts/Admin/views/htdm/' + module + '/' + action + '.html';
        };
        return result;
    }]);

    return app;
});