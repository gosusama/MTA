﻿define(['ui-bootstrap'], function () {
    'use strict';
    var app = angular.module('mediaModule', ['ui.bootstrap']);
    app.factory('mediaService',['$http', 'configService', function ($http, configService) {
        var serviceUrl = configService.rootUrlWebApi + '/NV/Media';
        var result = {
            addNewMedia: function (instance) {

            },
            getImgForByCodeParent : function(code){
                return $http.get(serviceUrl + '/GetImgForByCodeParent/' + code);
            }
        };
        return result
    }]);
});