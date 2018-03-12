require.config({
    base: '/',
    paths: {
        'jquery': 'lib/jquery.min',
        'bootstrap': 'lib/bootstrap.min',
        'angular': 'lib/angular.min',
        'angular-animate': 'lib/angular-animate.min',
        'angular-resource': 'lib/angular-resource.min',
        'angular-filter': 'lib/angular-filter.min',
        'angular-sanitize': 'lib/angular-sanitize.min',
        'angular-cache': 'lib/angular-cache.min',
        'ocLazyLoad': 'lib/ocLazyLoad.require',
        'uiRouter': 'lib/angular-ui-router.min',
        'angularStorage': 'lib/angular-local-storage.min',
        'ui-bootstrap': 'lib/ui-bootstrap-tpls-1.3.3',
        'loading-bar': 'utils/loading-bar/loading-bar.min',
        'smartTable': 'utils/smart-table.min',
        'ngTable': 'utils/ng-table.min',
        'ngNotify': 'utils/ng-notify/ng-notify.min',
        'toaster': 'utils/toaster/toaster.min',
    },
    shim: {
        'jquery': {
            exports: '$'
        },
        'bootstrap': ['jquery'],
        'angular': {
            deps: ['jquery', 'bootstrap'],
            exports: 'angular'
        },
        'ocLazyLoad': ['angular'],
        'uiRouter': ['angular'],
        'angular-animate': ['angular'],
        'angular-resource': ['angular'],
        'angular-filter': ['angular'],
        'angular-cache': ['angular'],
        'angular-sanitize': ['angular'],
        'angularStorage': ['angular'],
        'ui-bootstrap': ['angular'],
        'loading-bar': ['angular'],
        'smartTable': ['angular'],
        'ngTable': ['angular'],
        'ngNotify': ['angular'],
        'toaster': ['angular'],
    },
    waitSeconds: 0
});

// Start the main app logic.
require(['app'], function () {
    angular.bootstrap(document.body, ['myApp']);
});
