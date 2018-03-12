define(['angular', 'controllers/auth/auth-controller', 'controllers/htdm/dmmenu_ctrl'], function (angular) {
    var app = angular.module('headerModule', ['authModule', 'configModule', 'dmmenu_Module']);
    var layoutUrl = "/Layouts/Admin/";
    app.directive('tree', function () {
        return {
            restrict: "E",
            replace: true,
            scope: {
                tree: '='
            },
            templateUrl: layoutUrl + 'utils/tree/template-ul.html'
        };
    });
    app.directive('leaf', function ($compile) {
        return {
            restrict: "E",
            replace: true,
            scope: {
                leaf: "="
            },
            templateUrl: layoutUrl + 'utils/tree/template-li.html',
            link: function (scope, element, attrs) {
                if (angular.isArray(scope.leaf.Children) && scope.leaf.Children.length > 0) {
                    element.append("<tree tree='leaf.Children'></tree>");
                    element.addClass('dropdown-submenu');
                    $compile(element.contents())(scope);
                }
            }
        };
    });
    app.controller('HeaderCtrl', ['$scope', 'configService', '$state', 'accountService', '$log', 'userService', 'dmmenu_Service',
    function ($scope, configService, $state, accountService, $log, userService, service) {

        $scope.date = new Date();
        function treeify(list, idAttr, parentAttr, childrenAttr) {
            if (!idAttr) idAttr = 'value';
            if (!parentAttr) parentAttr = 'parent';
            if (!childrenAttr) childrenAttr = 'children';
            var lookup = {};
            var result = {};
            result[childrenAttr] = [];
            list.forEach(function (obj) {
                lookup[obj[idAttr]] = obj;
                obj[childrenAttr] = [];
            });
            list.forEach(function (obj) {
                if (obj[parentAttr] != null) {
                    try { lookup[obj[parentAttr]][childrenAttr].push(obj); }
                    catch (err) {
                        result[childrenAttr].push(obj);
                    }

                } else {
                    result[childrenAttr].push(obj);
                }
            });
            return result;
        };
        function loadUser() {
            $scope.currentUser = userService.GetCurrentUser();
            if (!$scope.currentUser) {
                $state.go('login');
            }
            service.getMenu().then(function (response) {
                if (response.status ==200 && response.data.data) {
                    $scope.lstMenu = angular.copy(response.data.data);
                    service.setData(response.data.data);
                    $scope.treeMenu = treeify($scope.lstMenu);
                    console.log($scope.treeMenu.children);
                } else {
                }
            }, function (response) {
            });

        }
        loadUser();
        $scope.logOut = function () {
            accountService.logout();
        };
    }]);
    return app;
});