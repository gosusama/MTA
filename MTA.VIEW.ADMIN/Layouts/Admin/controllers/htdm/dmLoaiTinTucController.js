define(['ui-bootstrap'], function () {
    'use strict';
    var app = angular.module('dmLoaiTinTuc_Module', ['ui.bootstrap']);

    app.factory('dmLoaiTinTuc_Service', ['$http', 'configService', function ($http, configService) {
        var serviceUrl = configService.rootUrlWebApi + '/DM/LoaiTinTuc';
        var selectedData = [];
        var result = {
            post: function (data) {
                console.log('data', data);
                return $http.post(serviceUrl + '/Insert', data);
            },
            postQuery: function (data) {
                return $http.post(serviceUrl + '/PostQuery', data);
            },
            deleteItem: function (params) {
                return $http.delete(serviceUrl + '/DeleteItem/' + params.id, params);
            },
            update: function (params) {
                return $http.put(serviceUrl + '/edit/' + params.id, params)
            },
            getNewInstance: function () {
                return $http.get(serviceUrl + '/getNewInstance');
            },
            dmLoaiTinTucCtl_GetSelectDataByUnitCode_page: function (data) {
                return $http.post(serviceUrl + '/dmLoaiTinTucCtl_GetSelectDataByUnitCode_page', data);
            },
            filterLoaiTinTuc: function (ma_LoaiTinTuc) {
                return $http.post(serviceUrl + '/FilterLoaiTinTuc/' + ma_LoaiTinTuc);
            },
            getSelectData: function () {
                return selectedData;
            },
            setSelectData: function (array) {
                selectedData = array;
            },
            clearSelectData: function () {
                selectedData = [];
            },
        }
        return result;
    }]);
    /* controller list */
    app.controller('dmLoaiTinTucController', ['$scope', '$location', '$http', 'configService', 'dmLoaiTinTuc_Service', 'tempDataService', '$filter', '$uibModal', '$log', 'securityService', 'toaster',
        function ($scope, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, securityService, toaster) {
            $scope.config = angular.copy(configService);
            $scope.paged = angular.copy(configService.pageDefault);
            $scope.filtered = angular.copy(configService.paramDefault);
            $scope.tempData = tempDataService.tempData;
            console.log('LoaiTinTuc');
            function filterData() {
                $scope.isLoading = true;
                var postdata = { paged: $scope.paged, filtered: $scope.filtered };
                service.postQuery(postdata).then(function (successRes) {
                    if (successRes && successRes.status === 200 && successRes.data.data.data) {
                        $scope.isLoading = false;
                        $scope.data = successRes.data.data.data;
                        console.log($scope.data);
                        angular.extend($scope.paged, successRes.data.data);
                    }
                }, function (errorRes) {
                    console.log(errorRes);
                });
            };
            filterData();
            //function loadAccessList() {
            //    securityService.getAccessList('auLoaiTinTuc').then(function (successRes) {
            //        if (successRes && successRes.status === 200) {
            //            $scope.accessList = successRes.data;
            //            if (!$scope.accessList.view) {
            //                toaster.pop('error', "Lỗi:", "Không có quyền truy cập !");
            //            } else {
            //                filterData();
            //            }
            //        } else {
            //            toaster.pop('error', "Lỗi:", "Không có quyền truy cập !");
            //        }
            //    }, function (errorRes) {
            //        toaster.pop('error', "Lỗi:", "Không có quyền truy cập !");
            //        $scope.accessList = null;
            //    });
            //}
            //loadAccessList();

            /* Function Select page */
            $scope.displayHelper = function (module, value) {
                var data = $filter('filter')($scope.tempData(module), { Value: value }, true);
                if (data.length === 1) {
                    return data[0].Text;
                } else {
                    return value;
                }
            }
            $scope.setPage = function (pageNo) {
                $scope.paged.currentPage = pageNo;
                filterData();
            };
            $scope.sortType = 'ma_LoaiTinTuc';
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
                    templateUrl: configService.buildUrl('htdm/dmLoaiTinTuc', 'addNew'),
                    controller: 'dmLoaiTinTucCreateController',
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
                console.log('target', target);
                var modalInstance = $uibModal.open({
                    backdrop: 'static',
                    templateUrl: configService.buildUrl('htdm/dmLoaiTinTuc', 'edit'),
                    controller: 'dmLoaiTinTucEditController',
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
                console.log('target', target);
                var modalInstance = $uibModal.open({
                    backdrop: 'static',
                    templateUrl: configService.buildUrl('htdm/dmLoaiTinTuc', 'delete'),
                    controller: 'dmLoaiTinTucDeleteController',
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
                    templateUrl: configService.buildUrl('htdm/dmLoaiTinTuc', 'details'),
                    controller: 'dmLoaiTinTucDetailsController',
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

    app.controller('dmLoaiTinTucCreateController', ['$scope', '$location', '$http', 'configService', 'dmLoaiTinTuc_Service', 'tempDataService', '$filter', '$uibModal', '$log', 'securityService', 'toaster', 'ngNotify', '$uibModalInstance', 'userService', '$timeout', 'Upload',
        function ($scope, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, securityService, toaster, ngNotify, $uibModalInstance, userService, $timeout, upload) {
            $scope.config = angular.copy(configService);
            $scope.tempData = tempDataService.tempData;
            $scope.target = {};
            $scope.isLoading = false;
            $scope.title = function () { return 'Thêm mới danh mục loại tin tức'; };
            $scope.target.ngayTao = new Date();
            function filterData() {
                service.getNewInstance().then(function (response) {
                    if (response && response.status == 200) {
                        $scope.target.ma_LoaiTinTuc = response.data;
                    }
                });
            }
            filterData();


            $scope.save = function () {
                service.post($scope.target).then(function (successRes) {

                    if (successRes && successRes.status === 201 && successRes.data.status) {
                        ngNotify.set(successRes.data.message, { type: 'success' });
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

    app.controller('dmLoaiTinTucDetailsController', ['$scope', '$uibModalInstance', '$location', '$http', 'configService', 'dmLoaiTinTuc_Service', 'tempDataService', '$filter', '$uibModal', '$log', 'ngNotify', 'targetData', '$sce',
        function ($scope, $uibModalInstance, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, ngNotify, targetData, $sce) {
            $scope.config = angular.copy(configService);
            $scope.tempData = tempDataService.tempData;
            $scope.target = angular.copy(targetData);
            console.log(' $scope.target', $scope.target);
            $scope.isLoading = false;
            $scope.title = function () { return 'Thông tin danh mục loại tin tức'; };

            $scope.cancel = function () {
                $uibModalInstance.close();
            };
        }]);

    app.controller('dmLoaiTinTucEditController', ['$scope', '$uibModalInstance', '$location', '$http', 'configService', 'dmLoaiTinTuc_Service', 'tempDataService', '$filter', '$uibModal', '$log', 'ngNotify', 'targetData', 'Upload', '$timeout',
    function ($scope, $uibModalInstance, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, ngNotify, targetData, upload, $timeout) {
        $scope.config = angular.copy(configService);
        $scope.tempData = tempDataService.tempData;
        $scope.target = angular.copy(targetData);
        $scope.isLoading = false;
        $scope.lstFile = [];
        $scope.lstImagesSrc = [];
        $scope.lstImages = [];
        $scope.isEdit = false;
        var temp = {};
        $scope.title = function () { return 'Cập nhật danh mục loại tin tức'; };

        $scope.save = function () {
            service.update($scope.target).then(function (successRes) {
                console.log('successRes', successRes);
                if (successRes && successRes.status === 200 && successRes.data.status) {
                    $uibModalInstance.close($scope.target);
                    ngNotify.set(successRes.data.message, { type: 'success' });
                } else {
                    console.log('addNew successRes', successRes);
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

    app.controller('dmLoaiTinTucDeleteController', ['$scope', '$uibModalInstance', '$location', '$http', 'configService', 'dmLoaiTinTuc_Service', 'tempDataService', '$filter', '$uibModal', '$log', 'targetData', 'ngNotify',
    function ($scope, $uibModalInstance, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, targetData, ngNotify) {
        $scope.config = angular.copy(configService);
        $scope.target = angular.copy(targetData);
        $scope.isLoading = false;
        $scope.title = function () { return 'Xoá loại tin tức'; };
        $scope.save = function () {
            service.deleteItem($scope.target).then(function (successRes) {
                if (successRes && successRes.status === 200) {
                    ngNotify.set('Xóa thành công', { type: 'success' });
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

    app.controller('dmLoaiTinTucSelectDataController', ['$scope', '$uibModalInstance', '$location', '$http', 'configService', 'dmLoaiTinTuc_Service', 'tempDataService', '$filter', '$uibModal', '$log', 'ngNotify', 'filterObject', 'serviceSelectData',
        function ($scope, $uibModalInstance, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, ngNotify, filterObject, serviceSelectData) {
            $scope.config = angular.copy(configService);;
            $scope.paged = angular.copy(configService.pageDefault);
            $scope.filtered = angular.copy(configService.filterDefault);
            $scope.filtered = angular.extend($scope.filtered, filterObject);
            angular.extend($scope.filtered, filterObject);
            var lstTemp = [];
            $scope.modeClickOneByOne = true;
            $scope.title = function () { return 'Danh sách loại tin tức'; };
            $scope.selecteItem = function (item) {
                $uibModalInstance.close(item);
            }
            $scope.isLoading = false;
            $scope.sortType = 'ma_LoaiTinTuc'; // set the default sort type
            $scope.sortReverse = false;  // set the default sort order
            function filterData() {
                if (serviceSelectData) {
                    $scope.modeClickOneByOne = false;
                }
                var postdata = {};
                if ($scope.modeClickOneByOne) {
                    $scope.isLoading = true;
                    postdata = { paged: $scope.paged, filtered: $scope.filtered };
                    service.dmLoaiTinTucCtl_GetSelectDataByUnitCode_page(postdata).then(function (response) {
                        $scope.isLoading = false;
                        if (response && response.status == 200 && response.data && response.data.status) {
                            $scope.data = response.data.data.data;
                            angular.extend($scope.paged, response.data);
                        }
                    });
                } else {
                    $scope.listSelectedData = serviceSelectData.getSelectData();
                    lstTemp = angular.copy($scope.listSelectedData);
                    $scope.isLoading = true;
                    postdata = { paged: $scope.paged, filtered: $scope.filtered };
                    service.dmLoaiTinTucCtl_GetSelectDataByUnitCode_page(postdata).then(function (response) {
                        $scope.isLoading = false;
                        if (response && response.status == 200 && response.data && response.data.status) {
                            $scope.data = response.data.data.data;
                            angular.forEach($scope.data, function (v, k) {
                                var isSelected = $scope.listSelectedData.some(function (element, index, array) {
                                    if (!element) return false;
                                    if (typeof element === 'string')
                                        return element == v.value;
                                    return element.value == v.value;
                                });
                                if (isSelected) {
                                    $scope.data[k].selected = true;
                                }
                            });
                            angular.extend($scope.paged, response.data);
                        }
                    });
                }
            };

            filterData();
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
            $scope.refresh = function () {
                $scope.setPage($scope.paged.currentPage);
            };
            $scope.doCheck = function (item) {
                if (item) {
                    var isSelected = $scope.listSelectedData.some(function (element, index, array) {
                        return element.id == item.id;
                    });
                    if (item.selected) {
                        if (!isSelected) {
                            $scope.listSelectedData.push(item);
                        }
                    } else {
                        if (isSelected) {
                            $scope.listSelectedData.splice(item, 1);
                        }
                    }
                } else {
                    angular.forEach($scope.data, function (v, k) {

                        $scope.data[k].selected = $scope.all;
                        var isSelected = $scope.listSelectedData.some(function (element, index, array) {
                            if (!element) return false;
                            return element.id == v.id;
                        });

                        if ($scope.all) {
                            if (!isSelected) {
                                $scope.listSelectedData.push($scope.data[k]);
                            }
                        } else {
                            if (isSelected) {
                                $scope.listSelectedData.splice($scope.data[k], 1);
                            }
                        }
                    });
                }
            };
            $scope.save = function () {
                $uibModalInstance.close($scope.listSelectedData);
            };
            $scope.cancel = function () {
                service.setSelectData(lstTemp);
                $uibModalInstance.close();
            };
        }]);
    return app;
});