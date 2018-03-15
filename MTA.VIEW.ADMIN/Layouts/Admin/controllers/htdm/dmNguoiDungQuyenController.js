define(['ui-bootstrap','controllers/htdm/dmmenu_ctrl'], function () {
    'use strict';
    var app = angular.module('dmNguoiDungQuyenModule', ['ui.bootstrap', 'dmmenu_Module']);
    app.factory('dmNguoiDungQuyenService', ['$http', 'configService', function ($http, configService) {
        var serviceUrl = configService.rootUrlWebApi + '/DM/NguoiDungQuyen';
        var result = {
            config: function (data) {
                return $http.post(serviceUrl + '/Config', data);
            },
            getByUsername: function (data) {
                return $http.get(serviceUrl + '/GetByUsername/' + data);
            }
        }
        return result;
    }]);
    /* controller list */
    app.controller('dmNguoiDungQuyenCreateCtrl', ['$scope', '$location', '$http', '$uibModalInstance', 'configService', 'dmNguoiDungQuyenService', 'tempDataService', '$filter', '$uibModal', '$log', 'ngNotify', 'securityService', 'toaster', 'dmmenu_Service', 'targetData',
        function ($scope, $location, $http, $uibModalInstance, configService, service, tempDataService, $filter, $uibModal, $log, ngNotify, securityService, toaster, serviceAuMenu, targetData) {
            $scope.config = {
                label: angular.copy(configService.label)
            };
            $scope.title = "Thêm mới phân quyền người dùng";
            $scope.data = [];
            $scope.lstChucNang = [];
            $scope.lstAdd = [];
            $scope.lstEdit = [];
            $scope.lstDelete = [];
            function loadQuyen() {
                service.getByUsername(targetData.username).then(function (successRes) {
                    if (successRes && successRes.status == 200) {
                        $scope.data = successRes.data.data;
                    } else {
                        toaster.pop('error', "Lỗi:", successRes.data.message);
                    }
                }, function (errorRes) {
                    console.log(errorRes);
                    toaster.pop('error', "Lỗi:", errorRes.statusText);
                })
                loadLstChucNang();
            }
            loadQuyen();

            function loadLstChucNang()
            {
                if ($scope.data) {
                    serviceAuMenu.getAllForConfigQuyen(targetData.username).then(function (successRes) {
                        if (successRes && successRes.status == 200) {
                            $scope.lstChucNang = successRes.data.data;
                        } else {
                            toaster.pop('error', "Lỗi:", successRes.data.message);
                        }
                    }, function (errorRes) {
                        console.log(errorRes);
                        toaster.pop('error', "Lỗi:", errorRes.statusText);
                    });
                }
            }
            $scope.selectChucNang = function (item) {
                var obj = {
                    machucnang: item.menuId,
                    tenchucnang: item.title,
                    sothutu: item.sort,
                    state: item.menuId,
                    xem: true,
                    username: targetData.username
                }
                $scope.lstAdd.push(obj);
                var filteredData = $filter('filter')($scope.lstChucNang, { menuId: item.menuId }, true);
                if (filteredData && filteredData.length > 0) {
                    var index = $scope.lstChucNang.indexOf(filteredData[0]);
                    if (index != -1) $scope.lstChucNang.splice(index, 1);
                }
            };

            $scope.deSelectChucNang = function (item) {
                console.log('a', item);
                $scope.lstChucNang.push({
                    menuId: item.machucnang,
                    menuIdCha: item.sothutu,
                    title: item.tenchucnang,
                    sort: parseInt(item.sothutu),
                });
                var filteredData = $filter('filter')($scope.data, { machucnang: item.machucnang }, true);
                if (filteredData && filteredData.length > 0) {
                    var index = $scope.data.indexOf(filteredData[0]);
                    if (index != -1) $scope.data.splice(index, 1);
                    if (filteredData[0].id) {
                        $scope.lstDelete.push({
                            ID: filteredData[0].id,
                            username: filteredData[0].username,
                            machucnang: filteredData[0].machucnang
                        });
                    }
                }
            };

            $scope.deSelectChucNangAdd = function (item) {
                $scope.lstChucNang.push({
                    menuId: item.machucnang,
                    menuIdCha: item.sothutu,
                    title: item.tenchucnang,
                    sort: item.sothutu
                });
                var filteredData = $filter('filter')($scope.lstAdd, { machucnang: item.machucnang }, true);
                if (filteredData && filteredData.length > 0) {
                    var index = $scope.lstAdd.indexOf(filteredData[0]);
                    if (index != -1) $scope.lstAdd.splice(index, 1);
                }
            };

            $scope.modified = function (item) {
                var filteredData = $filter('filter')($scope.lstEdit, { machucnang: item.machucnang }, true);
                if (!filteredData || filteredData.length < 1) {
                    $scope.lstEdit.push(item);
                }
            };

            $scope.save = function () {
                var obj = {
                    USERNAME: targetData.username,
                    LstAdd: $scope.lstAdd,
                    LstEdit: $scope.lstEdit,
                    LstDelete: $scope.lstDelete
                }
                service.config(obj).then(function (successRes) {
                    if (successRes && successRes.status == 200) {
                        toaster.pop('success', "Thông báo", successRes.data.message, 2000);
                        $uibModalInstance.close(successRes.data.data);
                    } else {
                        toaster.pop('error', "Lỗi:", successRes.data.message);
                    }
                }, function (errorRes) {
                    console.log(errorRes);
                    toaster.pop('error', "Lỗi:", errorRes.statusText + errorRes.data.message);
                });
            };
            $scope.cancel = function () {
                $uibModalInstance.close();
            };
        }]);
    return app;
});

