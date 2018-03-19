define(['ui-bootstrap'], function () {
    'use strict';
    var app = angular.module('dmNghienCuuModule', ['ui.bootstrap']);
    app.factory('dmNghienCuuService', ['$http', 'configService', function ($http, configService) {
        var serviceUrl = configService.rootUrlWebApi + '/DM/NghienCuu';
        var result = {
            postQuery: function (params) {
                return $http.post(serviceUrl +'/PostQuery',params);
            }
        };
        return result;
    }]);

    app.controller('dmNghienCuuController', ['$scope', '$location', '$http', 'configService', 'dmNghienCuuService', 'tempDataService', '$filter', '$uibModal', '$log', 'securityService', 'toaster', '$state',
        function ($scope, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, securityService, toaster, $state) {
            $scope.config = angular.copy(configService);
            $scope.paged = angular.copy(configService.pageDefault);
            $scope.filtered = angular.copy(configService.paramDefault);
            $scope.tempData = tempDataService.tempData;
            $scope.title = function () {
                return 'Danh sách nghiên cứu';
            };
            function filterData() {
                $scope.isLoading = true;
                var postdata = { paged: $scope.paged, filtered: $scope.filtered };
                service.postQuery(postdata).then(function (successRes) {
                    if (successRes && successRes.status === 200 && successRes.data.data.data) {
                        $scope.isLoading = false;
                        $scope.data = successRes.data.data.data;
                        angular.extend($scope.paged, successRes.data.data);
                    }
                }, function (errorRes) {
                    console.log(errorRes);
                });
            }

            function loadAccessList() {
                securityService.getAccessList('auMenu').then(function (successRes) {
                    if (successRes && successRes.status === 200) {
                        $scope.accessList = successRes.data;
                        if (!$scope.accessList.view) {
                            toaster.pop('error', "Lỗi:", "Không có quyền truy cập !");
                        } else {
                            filterData();
                        }
                    } else {
                        toaster.pop('error', "Lỗi:", "Không có quyền truy cập !");
                    }
                }, function (errorRes) {
                    toaster.pop('error', "Lỗi:", "Không có quyền truy cập !");
                    $scope.accessList = null;
                });
            }
            loadAccessList();
            $scope.setPage = function (pageNo) {
                $scope.paged.currentPage = pageNo;
                filterData();
            };
            $scope.sortType = 'ma_Dm';
            $scope.sortReverse = false;
            $scope.doSearch = function () {
                $scope.paged.currentPage = 1;
                filterData();
            };
            $scope.pageChanged = function () {
                filterData();
            };
            $scope.goHome = function () {
                window.location.href = "#!/home";
            };
            $scope.refresh = function () {
                $scope.setPage($scope.paged.currentPage);
            };
            /* Function add New Item */
            $scope.create = function () {
                var modalInstance = $uibModal.open({
                    backdrop: 'static',
                    size: 'lg',
                    templateUrl: configService.buildUrl('htdm/dmNghienCuu', 'addNew'),
                    controller: 'dmNghienCuuCreateController',
                    resolve: {}
                });
                modalInstance.result.then(function (updatedData) {
                    $scope.refresh();
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };

            /* Function Edit Item */
            $scope.update = function (target) {
                var modalInstance = $uibModal.open({
                    backdrop: 'static',
                    templateUrl: configService.buildUrl('htdm/dmGioiThieu', 'edit'),
                    controller: 'dmGioiThieuEditController',
                    resolve: {
                        targetData: function () {
                            return target;
                        }
                    }
                });
                modalInstance.result.then(function (updatedData) {
                    $scope.refresh();
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };

            /* Function Delete Item */
            $scope.deleteItem = function (event, target) {
                var modalInstance = $uibModal.open({
                    backdrop: 'static',
                    templateUrl: configService.buildUrl('htdm/dmGioiThieu', 'delete'),
                    controller: 'dmGioiThieuDeleteController',
                    resolve: {
                        targetData: function () {
                            return target;
                        }
                    }
                });
                modalInstance.result.then(function (updatedData) {
                    $scope.refresh();
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };
            /* End Function Select page */
            $scope.details = function (target) {
                var modalInstance = $uibModal.open({
                    backdrop: 'static',
                    templateUrl: configService.buildUrl('htdm/dmGioiThieu', 'details'),
                    controller: 'dmGioiThieuDetailsController',
                    resolve: {
                        targetData: function () {
                            return target;
                        }
                    }
                });
                modalInstance.result.then(function (updatedData) {
                    $scope.refresh();
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };
        }
    ]);
    app.controller('dmNghienCuuCreateController', ['$scope', '$location', '$http', 'configService', 'dmNghienCuuService', 'tempDataService', '$filter', '$uibModal', '$log', 'securityService', 'toaster', 'ngNotify', '$uibModalInstance', 'userService', '$timeout', 'Upload',
        function ($scope, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, securityService, toaster, ngNotify, $uibModalInstance, userService, $timeout, upload) {
            $scope.config = angular.copy(configService);
            $scope.tempData = tempDataService.tempData;
            $scope.target = {};
            $scope.lstFile = [];
            $scope.lstImagesSrc = [];
            $scope.lstImagesSrcFromDb = [];
            $scope.isLoading = false;
            $scope.title = function () { return 'Thêm mới danh mục nghiên cứu'; };
            $scope.target.ngayTao = new Date();
            $scope.target.manguoitao = userService.GetCurrentUser();
            $scope.target.ten_Media = [];

            $scope.save = function () {
                
            };

            $scope.cancel = function () {
                $uibModalInstance.close();
            };
        }]);
    return app;
});