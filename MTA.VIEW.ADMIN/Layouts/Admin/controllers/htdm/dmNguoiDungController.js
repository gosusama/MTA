define(['ui-bootstrap'], function () {
    'use strict';
    var app = angular.module('dmNguoiDungModule', ['ui.bootstrap']);
    app.factory('dmNguoiDungService', ['$http', 'configService', function ($http, configService) {
        var serviceUrl = configService.rootUrlWebApi + '/DM/NguoiDung';
        var allMenu = [];
        var selectedData = [];
        var result = {
            postQuery: function (data) {
                return $http.post(serviceUrl + '/PostQuery', data);
            },
            postSelectData: function (data) {
                return $http.post(serviceUrl + '/PostSelectData', data);
            },
            post: function (data) {
                return $http.post(serviceUrl + '/Post', data);
            },
            getAll_NguoiDung: function () {
                return $http.get(serviceUrl + '/GetSelectData');
            },
            getCurrentUser: function (callback) {
                $http.get(serviceUrl + '/GetCurrentUser').success(callback);
            },
            update: function (params) {
                return $http.put(serviceUrl + '/Put/' + params.id, params);
            },
            deleteItem: function (params) {
                return $http.delete(serviceUrl + '/Delete/' + params.id, params);
            },
            checkUserNameExist: function (params) {
                return $http.get(serviceUrl + '/CheckUserNameExist/' + params);
            },
            getUserByProfile: function (params, callback) {
                $http.get(serviceUrl + '/GetUserByProfile/' + params).success(callback);
            },
            getNewInstance: function (unitCode) {
                return $http.get(serviceUrl + '/GetNewInstance/' + unitCode);
            }
        }
        return result;
    }]);
    /* controller list */
    app.controller('dmNguoiDungController', ['$scope', '$location', '$http', 'configService', 'dmNguoiDungService', 'tempDataService', '$filter', '$uibModal', '$log', 'securityService', 'toaster',
        function ($scope, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, securityService, toaster) {
            $scope.config = angular.copy(configService);
            $scope.paged = angular.copy(configService.pageDefault);
            $scope.filtered = angular.copy(configService.filterDefault);
            $scope.tempData = tempDataService.tempData;
            $scope.accessList = {};
            function filterData() {
                if ($scope.accessList.view) {
                    $scope.isLoading = true;
                    var postdata = { paged: $scope.paged, filtered: $scope.filtered };
                    service.postQuery(postdata).then(function (response) {
                            $scope.isLoading = false;
                            if (response.status == 200) {
                                $scope.data = response.data.data.data;
                                angular.extend($scope.paged, response.data.data);

                            }
                        });
                }
            };

            function loadAccessList() {
                securityService.getAccessList('AuNguoiDung').then(function (successRes) {
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
            $scope.setPage = function (pageNo) {
                $scope.paged.currentPage = pageNo;
                filterData();
            };
            $scope.sortType = 'userName'; // set the default sort type
            $scope.sortReverse = false; // set the default sort order
            $scope.doSearch = function () {
                $scope.paged.currentPage = 1;
                filterData();
            };
            $scope.pageChanged = function () {
                filterData();
            };

            $scope.refresh = function () {
                $scope.setPage($scope.paged.currentPage);
            };
            $scope.title = function () {
                return 'Tài khoản người dùng';
            };
            $scope.create = function () {
                var modalInstance = $uibModal.open({
                    backdrop: 'static',
                    size: 'lg',
                    templateUrl: configService.buildUrl('htdm/dmNguoiDung', 'add'),
                    controller: 'dmNguoiDungCreateController',
                    resolve: {
                    }
                });
                modalInstance.result.then(function (updatedData) {
                    $scope.refresh();
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };

            $scope.deleteItem = function (event, target) {
                var modalInstance = $uibModal.open({
                    backdrop: 'static',
                    size: 'lg',
                    templateUrl: configService.buildUrl('htdm/dmNguoiDung', 'delete'),
                    controller: 'dmNguoiDungDeleteController',
                    resolve: {
                        targetData: function () {
                            return target;
                        }
                    }
                });
                modalInstance.result.then(function (updatedData) {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };

            $scope.details = function (target) {
                console.log('target',target);
                var modalInstance = $uibModal.open({
                    backdrop : 'static',
                    size: 'md',
                    templateUrl: configService.buildUrl('htdm/dmNguoiDung', 'details'),
                    controller: 'dmNguoiDungDetailsController',
                    resolve: {
                        targetData: function () {
                            return target;
                        }
                    }
                });
                modalInstance.result.then(function(updatedData){
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };
        }]);
    app.controller('dmNguoiDungDetailsController', ['$scope', '$uibModalInstance', '$location', '$http', 'configService', 'dmNguoiDungService', 'tempDataService', '$filter', '$uibModal', '$log', 'ngNotify', 'targetData',
        function ($scope, $uibModalInstance, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, ngNotify,targetData) {
            $scope.config = angular.copy(configService);
            $scope.tempData = tempDataService.tempData;
            $scope.target = targetData;
            $scope.isLoading = false;
            $scope.title = function () { return 'Thông tin người dùng'; };
            $scope.cancel = function () {
                $uibModalInstance.close();
            };
            $scope.displayHelper = function (module, value) {
                var data = $filter('filter')($scope.tempData(module), { Value: value }, true);
                if (data.length === 1) {
                    return data[0].Text;
                } else {
                    return value;
                }
            };
        }]);
    app.controller('dmNguoiDungDeleteController', ['$scope', '$uibModalInstance', '$location', '$http', 'configService', 'dmNguoiDungService', 'tempDataService', '$filter', '$uibModal', '$log', 'ngNotify', 'targetData',
    function ($scope, $uibModalInstance, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, ngNotify,targetData) {
        $scope.config = angular.copy(configService);
        $scope.isLoading = false;
        $scope.target = targetData;
        $scope.title = function () { return 'Xoá thành phần'; };
        $scope.save = function () {
            service.deleteItem($scope.target).then(function (successRes) {
                if (successRes && successRes.status === 200) {
                    ngNotify.set("Xóa thành công", { type: 'success' });
                    $uibModalInstance.close($scope.target);
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
    app.controller('dmNguoiDungCreateController', ['$scope', '$location', '$http', 'configService', 'dmNguoiDungService', 'tempDataService', '$filter', '$uibModal', '$log', 'securityService', 'toaster', 'ngNotify', '$uibModalInstance', 'userService',
        function ($scope, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, securityService, toaster,ngNotify,$uibModalInstance,serviceAuthUser) {
            var currentUser = serviceAuthUser.GetCurrentUser();
            $scope.config = angular.copy(configService);
            $scope.paged = angular.copy(configService.pageDefault);
            $scope.filtered = angular.copy(configService.filterDefault);
            $scope.tempData = tempDataService.tempData;
            $scope.isExist = false;
            service.getNewInstance(currentUser.unitCode).then(function (response) {
                if (response && response.status == 200 && response.data) {
                    $scope.target.maNhanVien = response.data;
                }
            });
            $scope.enterUserNameProfiles = function (input) {
                if (input) {
                    service.checkUserNameExist(input).then(function (response) {
                        console.log(response);
                        if (response.data.status) {
                            ngNotify.set("Đã tồn tại tên người dùng này !", { duration: 3000, type: 'error' });
                            $scope.isExist = true;
                        } else {
                            $scope.isExist = false;
                        }
                    });

                }
            };
            $scope.save = function () {
                service.post($scope.target).then(function (response) {
                        //Fix
                        if (response.status) {
                            console.log('Create  Successfully!');
                            ngNotify.set("Thêm mới thành công", { type: 'success' });
                            $uibModalInstance.close($scope.target);

                        } else {
                            ngNotify.set(response.message, { duration: 3000, type: 'error' });
                        }
                        //End fix
                    });
            };
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }]);
    return app;
});
console.log("OK");

