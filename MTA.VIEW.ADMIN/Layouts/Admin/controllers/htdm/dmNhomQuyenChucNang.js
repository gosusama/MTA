define(['ui-bootstrap', 'controllers/htdm/dmmenu_ctrl'], function () {
    'use strict';
    var app = angular.module('dmNhomQuyenChucNangModule', ['ui.bootstrap', 'dmmenu_Module']);
    app.factory('dmNhomQuyenChucNangService', ['$http', 'configService', function ($http, configService) {
        var serviceUrl = configService.rootUrlWebApi + '/Dm/NhomQuyenChucNang';
        var result = {
            paging: function (data) {
                return $http.post(serviceUrl + '/paging', data);
            },
            post: function (data) {
                return $http.post(serviceUrl + '/Post', data);
            },
            getItem: function (id) {
                return $http.get(serviceUrl + '/' + id);
            },
            getByMaNhomQuyen: function (manhomquyen) {
                return $http.get(serviceUrl + '/GetByMaNhomQuyen/' + manhomquyen);
            },
            update: function (params) {
                return $http.put(serviceUrl + '/' + params.ID, params);
            },
            deleteItem: function (params) {
                return $http.delete(serviceUrl + '/' + params.ID);
            },
            getSelectData: function () {
                return $http.get(serviceUrl + '/GetSelectData');
            },
            config: function (data) {
                return $http.post(serviceUrl + '/Config', data);
            }
        }
        return result;
    }]);
    /* controller list */
    app.controller('dmNhomQuyenChucNangConfigCtrl', ['$scope', '$location', '$http', '$uibModalInstance', 'configService', 'dmNhomQuyenChucNangService', 'tempDataService', '$filter', '$uibModal', '$log', 'ngNotify', 'securityService', 'toaster', 'dmmenu_Service', 'targetData',
        function ($scope, $location, $http, $uibModalInstance, configService, service, tempDataService, $filter, $uibModal, $log, ngNotify, securityService, toaster, AuMenuService, targetData) {
            $scope.config = {
                label: angular.copy(configService.label)
            };
            $scope.title = "Cấu hình nhóm quyền :" + targetData.tennhomquyen;
            $scope.tempData = tempDataService.tempData;
            $scope.target = angular.copy(targetData);
            $scope.data = [];
            $scope.lstChucNang = [];
            $scope.lstAdd = [];
            $scope.lstEdit = [];
            $scope.lstDelete = [];
            function loadNhomQuyen() {
                service.getByMaNhomQuyen(targetData.manhomquyen).then(function (successRes) {
                    if (successRes && successRes.status == 200) {
                        $scope.data = successRes.data.data;                       
                        return $scope.data;
                    } else {
                        toaster.pop('error', "Lỗi:", successRes.data.message);
                        return null;
                    }
                }, function (errorRes) {
                    toaster.pop('error', "Lỗi:", errorRes.statusText);
                }).then(function (data) {
                    if (data) {
                        AuMenuService.getAllForConfigNhomQuyen(targetData.manhomquyen).then(function (successRes) {
                            console.log('successRes', successRes);
                            if (successRes && successRes.status == 200) {
                                $scope.lstChucNang = successRes.data.data;
                            } else {
                                toaster.pop('error', "Lỗi:", successRes.data.message);
                            }
                        }, function (errorRes) {
                            toaster.pop('error', "Lỗi:", errorRes.statusText);
                        });
                    }
                });
            }
            loadNhomQuyen();

            $scope.selectChucNang = function (item) {
                var obj = {
                    machucnang: item.menuId,
                    tenchucnang: item.title,
                    sothutu: item.sort,
                    state: item.menuId,
                    xem: true,
                    manhomquyen: targetData.manhomquyen
                }
                $scope.lstAdd.push(obj);
                var filteredData = $filter('filter')($scope.lstChucNang, { menuId: item.menuId }, true);
                if (filteredData && filteredData.length > 0) {
                    var index = $scope.lstChucNang.indexOf(filteredData[0]);
                    if (index != -1) $scope.lstChucNang.splice(index, 1);
                }
            };

            $scope.deSelectChucNang = function (item) {
                if ($scope.lstChucNang) {
                    $scope.lstChucNang.push({
                        menuId: item.machucnang,
                        menuIdCha: item.sothutu,
                        title: item.tenchucnang,
                        sort: parseInt(item.sothutu),
                    });
                }
                else{
                    $scope.lstChucNang = [{
                        menuId: item.machucnang,
                        menuIdCha: item.sothutu,
                        title: item.tenchucnang,
                        sort: parseInt(item.sothutu),
                    }];
                }
                var filteredData = $filter('filter')($scope.data, { machucnang: item.machucnang }, true);
                if (filteredData && filteredData.length > 0) {
                    var index = $scope.data.indexOf(filteredData[0]);
                    if (index != -1) $scope.data.splice(index, 1);
                    if (filteredData[0].id) {
                        $scope.lstDelete.push({
                            id: filteredData[0].id,
                            manhomquyen: filteredData[0].manhomquyen,
                            machucnang: filteredData[0].machucnang
                        });
                    }
                }
            };

            $scope.deSelectChucNangAdd = function (item) {
                if ($scope.lstChucNang) {
                    $scope.lstChucNang.push({
                        menuId: item.machucnang,
                        menuIdCha: item.sothutu,
                        title: item.tenchucnang,
                        sort: parseInt(item.sothutu),
                    });
                }
                else {
                    $scope.lstChucNang = [{
                        menuId: item.machucnang,
                        menuIdCha: item.sothutu,
                        title: item.tenchucnang,
                        sort: parseInt(item.sothutu),
                    }];
                }

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
                    MANHOMQUYEN: targetData.manhomquyen,
                    LstAdd: $scope.lstAdd,
                    LstEdit: $scope.lstEdit,
                    LstDelete: $scope.lstDelete
                }
                console.log('obj', obj);
                service.config(obj).then(function (successRes) {
                    if (successRes && successRes.status == 200) {
                        toaster.pop('success', "Thông báo", successRes.data.message, 2000);
                        $uibModalInstance.close(successRes.data.data);
                    } else {
                        toaster.pop('error', "Lỗi:", successRes.data.message);
                    }
                }, function (errorRes) {
                    toaster.pop('error', "Lỗi:", errorRes.statusText + errorRes.data.message);
                });
            };

            $scope.cancel = function () {
                $uibModalInstance.close();
            };
        }]);
    return app;
});