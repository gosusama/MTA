/*  
* Người tạo : Phạm Tuấn Anh
* View: BTS.SP.MART/views/htdm/AuNhomQuyen
* Menu: Danh mục-> Danh mục nhóm quyền
*/
define(['ui-bootstrap'], function () {
    'use strict';
    var app = angular.module('dmNhomQuyenModule', ['ui.bootstrap']);
    app.factory('dmNhomQuyenService', ['$http', 'configService', function ($http, configService) {
        var serviceUrl = configService.rootUrlWebApi + '/Dm/NhomQuyen';
        var result = {
            Select_Page: function (data) {
                return $http.post(serviceUrl + '/Select_Page', data);
            },
            addNew: function (data) {
                return $http.post(serviceUrl + '/Add', data);
            },
            getItem: function (id) {
                return $http.get(serviceUrl + '/' + id);
            },
            update: function (params) {
                return $http.put(serviceUrl + '/Update/' + params.id, params);
            },
            deleteItem: function (params) {
                return $http.delete(serviceUrl + '/DeleteItem/' + params.id, params);
            },
            getNhomQuyenConfig: function (data) {
                return $http.get(serviceUrl + '/getNhomQuyenConfig/' + data);
            },
            getSelectData: function () {
                return $http.get(serviceUrl + '/getSelectData');
            }
        }
        return result;
    }]);
    /* controller list */
    app.controller('dmNhomQuyenController', ['$scope', '$location', '$http', 'configService', 'dmNhomQuyenService', 'tempDataService', '$filter', '$uibModal', '$log', 'ngNotify', 'securityService', 'toaster',
        function ($scope, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, ngNotify, securityService, toaster) {
            $scope.config = {
                label: angular.copy(configService.label)
            }
            $scope.title = function () { return "Nhóm quyền" };
            $scope.paged = angular.copy(configService.pageDefault);
            $scope.filtered = angular.copy(configService.filterDefault);
            $scope.tempData = tempDataService.tempData;
            $scope.accessList = {};
            function filterData() {
                if ($scope.accessList.view) {
                    var postdata = { paged: $scope.paged, filtered: $scope.filtered };
                    service.Select_Page(postdata).then(function (successRes) {
                        if (successRes && successRes.status == 200 && successRes.data && !successRes.data.Error) {
                            $scope.data = successRes.data.data.data;
                            $scope.paged.totalItems = successRes.data.data.totalItems;
                        } else {
                            $scope.data = [];
                            $scope.paged.totalItems = 0;
                            toaster.pop('error', "Lỗi:", successRes.data.message);
                        }
                    }, function (errorRes) {
                        toaster.pop('error', "Lỗi:", errorRes.statusText);
                    });
                }
            };
            function loadAccessList() {
                securityService.getAccessList('auGroup').then(function (successRes) {
                    console.log('successRes', successRes);
                    if (successRes && successRes.status == 200) {
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
                    console.log(errorRes);
                    toaster.pop('error', "Lỗi:", "Không có quyền truy cập !");
                    $scope.accessList = null;
                });
            }
            loadAccessList();
            $scope.displayHepler = function (paraValue, moduleName) {
                var data = $filter('filter')($scope.tempData(moduleName), { value: paraValue }, true);
                if (data && data.length === 1) {
                    return data[0].text;
                } else {
                    return paraValue;
                }
            }
            $scope.setPage = function (pageNo) {
                $scope.paged.currentPage = pageNo;
                filterData();
            };

            $scope.doSearch = function () {
                $scope.paged.currentPage = 1;
                filterData();
            };

            $scope.pageChanged = function () {
                filterData();
            };

            $scope.goHome = function () {
                $state.go('home');
            };

            $scope.refresh = function () {
                $scope.setPage($scope.paged.currentPage);
            };

            $scope.detail = function (item) {
                $uibModal.open({
                    backdrop: 'static',
                    size: 'md',
                    templateUrl: configService.buildUrl('auth/AuNhomQuyen', 'detail'),
                    controller: 'AuNhomQuyenDetailCtrl',
                    resolve: {
                        targetData: function () {
                            return item;
                        }
                    }
                });
            };
            $scope.create = function () {
                var modalInstance = $uibModal.open({
                    backdrop: 'static',
                    size: 'md',
                    templateUrl: configService.buildUrl('htdm/dmNhomQuyen', 'add'),
                    controller: 'dmNhomQuyenCreateController',
                    resolve: {}
                });
                modalInstance.result.then(function (updatedData) {
                    $scope.refresh();
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };
            $scope.edit = function (item) {
                var modalInstance = $uibModal.open({
                    backdrop: 'static',
                    size: 'md',
                    templateUrl: configService.buildUrl('auth/AuNhomQuyen', 'edit'),
                    controller: 'AuNhomQuyenEditCtrl',
                    resolve: {
                        targetData: function () {
                            return item;
                        }
                    }
                });
                modalInstance.result.then(function (updatedData) {
                    $scope.refresh();
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };
            $scope.configItem = function (item) {
                var modalInstance = $uibModal.open({
                    backdrop: 'static',
                    size: 'lg',
                    windowClass: 'app-modal-window',
                    templateUrl: configService.buildUrl('auth/AuNhomQuyenChucNang', 'config'),
                    controller: 'AuNhomQuyenChucNangConfigCtrl',
                    resolve: {
                        targetData: function () {
                            return item;
                        }
                    }
                });
                modalInstance.result.then(function (updatedData) {
                    $log.info('Modal dismissed at: ' + new Date());
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };
            /* Function Delete Item */
            $scope.delete = function (event, target) {
                var modalInstance = $uibModal.open({
                    backdrop: 'static',
                    templateUrl: configService.buildUrl('htdm/dmNhomQuyen', 'delete'),
                    controller: 'dmNhomQuyenDeleteController',
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
        }]);

    /* controller Details */
    app.controller('AuNhomQuyenDetailCtrl', ['$scope', '$uibModalInstance', '$location', '$http', 'configService', 'AuNhomQuyenService', 'tempDataService', '$filter', '$uibModal', '$log', 'targetData', 'ngNotify', 'AuNhomQuyenChucNangChucNangService',
        function ($scope, $uibModalInstance, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, targetData, ngNotify, serviceAuNhomQuyenChucNang) {
            $scope.config = {
                label: angular.copy(configService.label)
            };
            $scope.title = "Chi tiết nhóm quyền : " + targetData.manhomquyen;
            $scope.tempData = tempDataService.tempData;
            //load danh muc
            function loadData() {
                serviceAuNhomQuyenChucNang.getByMaNhomQuyen(targetData.manhomquyen).then(function (successRes) {
                    if (successRes && successRes.status == 200) {
                        $scope.data = successRes.data.data;
                    } else {
                        toaster.pop('error', "Lỗi:", successRes.data.message);
                    }
                }, function (errorRes) {
                    console.log(errorRes);
                    toaster.pop('error', "Lỗi:", errorRes.statusText);
                });
            }
            loadData();
            $scope.cancel = function () {
                $uibModalInstance.close();
            };

        }]);
    /* controller Create */
    app.controller('dmNhomQuyenCreateController', ['$scope', '$uibModalInstance', '$location', '$http', 'configService', 'dmNhomQuyenService', 'tempDataService', '$filter', '$uibModal', '$log', 'ngNotify', 'toaster',
        function ($scope, $uibModalInstance, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, ngNotify, toaster) {
            $scope.config = {
                label: angular.copy(configService.label)
            };
            $scope.title = "Thêm mới nhóm quyền.";
            $scope.tempData = tempDataService.tempData;
            $scope.target = {};
            $scope.save = function () {
                service.addNew($scope.target).then(function (successRes) {
                    if (successRes && successRes.status == 200 && successRes.data.status) {
                        ngNotify.set("Thêm mới thành công", { type: 'success' });
                        $uibModalInstance.close(successRes.data.data);
                    } else {
                        ngNotify.set(successRes.data.message, { duration: 3000, type: 'error' });
                        $uibModalInstance.close();
                    }
                }, function (errorRes) {
                    console.log(errorRes);
                    ngNotify.set(successRes.data.message, { duration: 3000, type: 'error' });
                });
            };
            $scope.cancel = function () {
                $uibModalInstance.close();
            };
        }]);

    /* controller Create */
    app.controller('AuNhomQuyenEditCtrl', ['$scope', '$uibModalInstance', '$location', '$http', 'configService', 'AuNhomQuyenService', 'tempDataService', '$filter', '$uibModal', '$log', 'targetData', 'ngNotify', 'toaster',
        function ($scope, $uibModalInstance, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, targetData, ngNotify, toaster) {
            $scope.config = {
                label: angular.copy(configService.label)
            };
            $scope.title = "Cập nhật nhóm quyền.";
            $scope.tempData = tempDataService.tempData;
            $scope.target = angular.copy(targetData);
            $scope.save = function () {
                service.update($scope.target).then(function (successRes) {
                    if (successRes && successRes.status == 200) {
                        toaster.pop('success', "Thông báo", "Cập nhật thành công", 2000);
                        $uibModalInstance.close(successRes.data.data);
                    } else {
                        ngNotify.set(successRes.data.message, { duration: 3000, type: 'error' });
                        $uibModalInstance.close();
                    }
                }, function (errorRes) {
                    console.log(errorRes);
                    ngNotify.set(successRes.data.message, { duration: 3000, type: 'error' });
                });
            };
            $scope.cancel = function () {
                $uibModalInstance.close();
            };
        }]);
    /* controller delete */
    app.controller('dmNhomQuyenDeleteController', ['$scope', '$uibModalInstance', '$location', '$http', 'configService', 'dmNhomQuyenService', 'tempDataService', '$filter', '$uibModal', '$log', 'targetData', 'ngNotify', 'toaster',
        function ($scope, $uibModalInstance, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, targetData, ngNotify, toaster) {
            $scope.config = angular.copy(configService);
            $scope.isLoading = false;
            $scope.title = function () { return 'Xoá thành phần'; };
            $scope.targetData = angular.copy(targetData);
            $scope.save = function () {
                service.deleteItem($scope.targetData).then(function (successRes) {
                    if (successRes && successRes.data.status) {
                        ngNotify.set("Xóa thành công", { type: 'success' });
                        $uibModalInstance.close($scope.targetData);
                    } else {
                        ngNotify.set(successRes.data.message, { duration: 3000, type: 'error' });
                    }
                },
                function (errorRes) {
                    console.log('errorRes', errorRes);
                });
            };
            $scope.cancel = function () {
                $uibModalInstance.close();
            };
        }]);
    return app;
});

