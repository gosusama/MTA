/**
 * loads sub modules and wraps them up into the main module
 * this should be used for top-level module definitions only
 */
define([
	'jquery',
    'angular',
    'states/htdm',
    'config/config',
	'ocLazyLoad',
	'uiRouter',
	'angularStorage',
    'angular-animate',
    'angular-resource',
    'angular-filter',
    'angular-sanitize',
    'angular-cache',
	'ui-bootstrap',
    'loading-bar',
    'smartTable',
    'ngTable',
    'ngNotify',
    'toaster',
	'services/interceptorService',
    'services/configService',
    'services/tempDataService',
    'filters/common',
    'ng-ckeditor',
    'fileUpload',
    'ng-file-upload',
], function (jquery, angular, state_htdm) {
    'use strict';
    var app = angular.module('myApp', ['oc.lazyLoad', 'ui.router', 'InterceptorModule', 'LocalStorageModule', 'ui.bootstrap', 'configModule', 'tempDataModule', 'angular-loading-bar', 'ngAnimate', 'ngSanitize', 'common-filter', 'ngResource', 'smart-table', 'angular.filter', 'ngTable', 'angular-cache', 'ngNotify', 'toaster', 'ngCkeditor', 'angularFileUpload', 'ngFileUpload']);
    app.run(['ngTableDefaults', 'ngNotify', function (ngTableDefaults, ngNotify) {
        ngTableDefaults.params.count = 5;
        ngTableDefaults.settings.counts = [];
        ngNotify.config({
            theme: 'pure',
            position: 'bottom',
            duration: 800,
            type: 'info',
            sticky: false,
            button: true,
            html: true
        });
    }]);
    app.directive('preventDefault', function () {
        return function (scope, element, attrs) {
            angular.element(element).bind('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
            });
        }
    });

    app.directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    });

    app.directive('focusMe', ['$timeout', '$parse', function ($timeout, $parse) {
        return {
            //scope: true,   // optionally create a child scope
            link: function (scope, element, attrs) {
                var model = $parse(attrs.focusMe);
                scope.$watch(model, function (value) {
                    console.log('value=', value);
                    if (value === true) {
                        $timeout(function () {
                            element[0].focus();
                        });
                    }
                });
                // to address @blesh's comment, set attribute value to 'false'
                // on blur event:
                element.bind('blur', function () {
                    console.log('blur');
                    scope.$apply(model.assign(scope, false));
                });
            }
        };
    }]);

    app.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('interceptorService');
    }]);
    app.config(function (CacheFactoryProvider) {
        angular.extend(CacheFactoryProvider.defaults, {
            maxAge: 3600000, //1 hour
            deleteOnExpire: 'aggressive',
            storageMode: 'memory',
            onExpire: function (key, value) {
                var _this = this; // "this" is the cache in which the item expired
                if (key.indexOf('/') !== -1) {
                    angular.injector(['ng']).get('$http').get(key).then(function (successRes) {
                        console.log('successRes', successRes);
                        _this.put(key, successRes.data);
                    }, function (errorRes) {
                        console.log('errorRes', errorRes);
                    });
                } else {
                    _this.put(key, value);
                    console.log(key, angular.toJson(value));
                }
            }
        });
    });

    app.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = true;
        cfpLoadingBarProvider.includeBar = true;
    }]);

    app.config(function (localStorageServiceProvider) {
        localStorageServiceProvider.setStorageType('cookie').setPrefix('ss');
    });

    app.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$locationProvider',
		function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $locationProvider) {
		    $ocLazyLoadProvider.config({
		        jsLoader: requirejs,
		        loadedModules: ['app'],
		        asyncLoader: require
		    });
		    var layoutUrl = "/Layouts/Admin/";
		    $urlRouterProvider.otherwise("/home");

		    $stateProvider.state('root', {
		        abstract: true,
		        views: {
		            'viewRoot': {
		                templateUrl: layoutUrl + "views/layouts/layout.html",
		                controller: "layoutCrtl as ctrl"

		            }
		        },
		        resolve: {
		            loadModule: ['$ocLazyLoad', '$q', function ($ocLazyLoad, $q) {
		                var deferred = $q.defer();
		                require(['controllers/layouts/layout-controller'],
                            function (layoutModule) {//url c?a module
                                deferred.resolve();
                                $ocLazyLoad.inject(layoutModule.name);
                            });
		                return deferred.promise;
		            }]
		        }
		    });

		    $stateProvider.state('layout', {
		        parent: 'root',
		        abstract: true,
		        views: {
		            'viewHeader': {
		                templateUrl: layoutUrl + "views/layouts/header.html",
		                controller: "HeaderCtrl as ctrl"
		            }
		        },
		        resolve: {
		            loadModule: [
                        '$ocLazyLoad', '$q', function ($ocLazyLoad, $q) {
                            var deferred = $q.defer();
                            require([
                                    'controllers/layouts/header-controller'
                            ],
                                function (headerModule) { //url c?a module
                                    deferred.resolve();
                                    $ocLazyLoad.inject(headerModule.name);
                                });
                            return deferred.promise;
                        }
		            ]

		        }
		    });

		    $stateProvider.state('login', {
		        url: "/login",
		        abstract: false,
		        views: {
		            'viewRoot': {
		                templateUrl: layoutUrl + "views/auth/login.html",
		                controller: "loginCrtl as ctrl"

		            }
		        },
		        resolve: {
		            loadModule: ['$ocLazyLoad', '$q', function ($ocLazyLoad, $q) {
		                var deferred = $q.defer();
		                require(['controllers/auth/auth-controller'],
                            function (layoutModule) {//url c?a module
                                deferred.resolve();
                                $ocLazyLoad.inject(layoutModule.name);
                            });
		                return deferred.promise;
		            }]
		        }
		    });

		    $stateProvider.state('home', {
		        url: "/home",
		        parent: 'layout',
		        abstract: false,
		        views: {
		            'viewMain@root': {
		                templateUrl: layoutUrl + "views/layouts/home.html",
		                controller: "homeCtrl as ctrl"
		            }
		        },
		        resolve: {
		            loadModule: ['$ocLazyLoad', '$q', function ($ocLazyLoad, $q) {
		                var deferred = $q.defer();
		                require(['controllers/layouts/home-controller'],
                            function (homeModule) {
                                deferred.resolve();
                                $ocLazyLoad.inject(homeModule.name);
                            });
		                return deferred.promise;
		            }]
		        }
		    });
		    
		    var lststate = [];
		    lststate = lststate.concat(state_htdm);
		    angular.forEach(lststate, function (state) {
		        $stateProvider.state(state.name, {
		            url: state.url,
		            parent: state.parent,
		            abstract: state.abstract,
		            views: state.views,
		            resolve: {
		                loadModule: ['$ocLazyLoad', '$q', function ($ocLazyLoad, $q) {
		                    var deferred = $q.defer();
		                    require([state.moduleUrl], function (module) {
		                        deferred.resolve();
		                        $ocLazyLoad.inject(module.name);
		                    });
		                    return deferred.promise;
		                }]
		            }
		        });
		    });		  
		}]);

    app.service('securityService', ['$http', 'configService', function ($http, configService) {
        var result = {
            getAccessList: function (machucnang) {
                return $http.get(configService.rootUrlWebApi + '/Authorize/Shared/GetAccesslist/' + machucnang);
            }
        };
        return result;
    }]);
    return app;
});
