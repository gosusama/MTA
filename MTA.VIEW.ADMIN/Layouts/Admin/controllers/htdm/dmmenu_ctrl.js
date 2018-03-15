define(['ui-bootstrap'], function () {
    'use strict';
    var app = angular.module('dmmenu_Module', ['ui.bootstrap']);
    app.factory('dmmenu_Service', ['$http', 'configService', function ($http, configService) {
        var serviceUrl = configService.rootUrlWebApi + '/DM/Menu';
        var allMenu = [];
        var selectedData = [];
        var result = {
            post: function (data) {
                return $http.post(serviceUrl + '/Insert', data);
            },
            postQuery: function (data) {
                return $http.post(serviceUrl + '/PostQuery', data);
            },
            getMenu: function (data) {
                return $http.get(serviceUrl + '/GetMenu/' + data);
            },
            setData: function (arr) {
                allMenu = arr;
            },
            getData: function () {
                return allMenu;
            },
            getMenuForByCode: function (code) {
                return $http.get(serviceUrl + '/GetMenuForByCode/' + code);
            },
            setSelectedData: function (arr) {
                selectedData = arr;
            },
            getSelectedData: function () {
                return selectedData;
            },
            deleteItem: function (params) {
                return $http.delete(serviceUrl + '/DeleteItem/' + params.id, params);
            },
            update: function (params) {
                return $http.put(serviceUrl + '/edit/' + params.id, params)
            },
            checkExistID: function (code) {
                return $http.get(serviceUrl + '/CheckExistID/'+code);
            },
            getAllForConfigNhomQuyen: function (params) {
                return $http.get(serviceUrl + '/GetAllForConfigNhomQuyen/' + params);
            },
            getAllForConfigQuyen: function (data) {
                return $http.get(serviceUrl + '/GetAllForConfigQuyen/'+data);
            }
        }
        return result;
    }]);
    /* controller list */
    app.controller('dmMenuCtr', ['$scope', '$location', '$http', 'configService', 'dmmenu_Service', 'tempDataService', '$filter', '$uibModal', '$log', 'securityService','toaster','$state',
        function ($scope, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, securityService, toaster,$state) {
            $scope.config = angular.copy(configService);
            $scope.paged = angular.copy(configService.pageDefault);
            $scope.filtered = angular.copy(configService.paramDefault);
            $scope.tempData = tempDataService.tempData;
            console.log('menu');
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
            };

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
            $scope.sortType = 'MAMENU';
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
                    size: 'md',
                    templateUrl: configService.buildUrl('htdm/dmmenu', 'addNew'),
                    controller: 'dmMenuCreateController',
                    resolve: {}
                });
                modalInstance.result.then(function (updatedData) {
                    $state.reload();
                    $scope.refresh();
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };

            /* Function Edit Item */
            $scope.update = function (target) {
                console.log('target',target);
                var modalInstance = $uibModal.open({
                    backdrop: 'static',
                    templateUrl: configService.buildUrl('htdm/dmmenu', 'edit'),
                    controller: 'dmMenuEditController',
                    resolve: {
                        targetData: function () {
                            return target;
                        }
                    }
                });
                modalInstance.result.then(function (updatedData) {
                    $state.reload();
                    $scope.refresh();
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };

            /* Function Delete Item */
            $scope.deleteItem = function (event , target) {
                console.log('target',target);
                var modalInstance = $uibModal.open({
                    backdrop: 'static',
                    templateUrl: configService.buildUrl('htdm/dmmenu', 'delete'),
                    controller: 'dmMenuDeleteController',
                    resolve: {
                        targetData: function () {
                            return target;
                        }
                    }
                });
                modalInstance.result.then(function (updatedData) {
                    $state.reload();
                    $scope.refresh();
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };
            /* End Function Select page */
            $scope.details = function (target) {
                var modalInstance = $uibModal.open({
                    backdrop: 'static',
                    templateUrl: configService.buildUrl('htdm/dmmenu', 'details'),
                    controller: 'dmMenuDetailsController',
                    resolve: {
                        targetData: function () {
                            return target;
                        }
                    }
                });
                modalInstance.result.then(function (updatedData) {
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };

        }]);
    app.controller('dmMenuDetailsController', ['$scope', '$uibModalInstance', '$location', '$http', 'configService', 'dmmenu_Service', 'tempDataService', '$filter', '$uibModal', '$log', 'ngNotify','targetData',
        function ($scope, $uibModalInstance, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, ngNotify,targetData) {
            $scope.config = angular.copy(configService);
            $scope.tempData = tempDataService.tempData;
            $scope.target = targetData;
            $scope.isLoading = false;
            $scope.title = function () { return 'Thông tin menu'; };
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
    app.controller('dmMenuDeleteController', ['$scope', '$uibModalInstance', '$location', '$http', 'configService', 'dmmenu_Service', 'tempDataService', '$filter', '$uibModal', '$log', 'targetData', 'ngNotify',
    function ($scope, $uibModalInstance, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, targetData, ngNotify) {
        $scope.config = angular.copy(configService);
        $scope.targetData = angular.copy(targetData);
        $scope.isLoading = false;
        $scope.title = function () { return 'Xoá thành phần'; };
        $scope.save = function () {
            service.deleteItem($scope.targetData).then(function (successRes) {
                if (successRes && successRes.status === 200) {
                    ngNotify.set('Xóa thành công', { type: 'success' });
                    $uibModalInstance.close($scope.target);
                } else {
                    console.log('deleteItem successRes ', successRes);
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
    app.controller('dmMenuEditController', ['$scope', '$uibModalInstance', '$location', '$http', 'configService', 'dmmenu_Service', 'tempDataService', '$filter', '$uibModal', '$log', 'ngNotify','targetData',
    function ($scope, $uibModalInstance, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, ngNotify,targetData) {
        $scope.config = angular.copy(configService);
        $scope.tempData = tempDataService.tempData;
        $scope.target = angular.copy(targetData);
        $scope.isLoading = false;
        $scope.title = function () { return 'Cập nhật menu'; };

        $scope.save = function () {
            service.update($scope.target).then(function (successRes) {
                console.log('successRes',successRes);
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
        $scope.checkExistID = function (target) {
            service.checkExistID(target).then(function (reponse) {
                if (reponse.data) {
                    $scope.isExist = true;
                    document.getElementById('menuId').focus();
                }
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    }]);
    app.controller('dmMenuCreateController',['$scope', '$location', '$http', 'configService', 'dmmenu_Service', 'tempDataService', '$filter', '$uibModal', '$log', 'securityService','toaster','ngNotify','$uibModalInstance','$document',
        function ($scope, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, securityService, toaster,ngNotify,$uibModalInstance,$document) {
            $scope.config = angular.copy(configService);
            $scope.tempData = tempDataService.tempData;
            $scope.target = {};
            $scope.isLoading = false;
            $scope.title = function () { return 'Thêm mới menu'; };           
            $scope.isExist = false;
            $scope.addNewItem = function (code) {
                var modalInstance = $uibModal.open({
                    backdrop: 'static',
                    templateUrl: configService.buildUrl('htdm/dmMenu', 'selectData'),
                    controller: 'selectedDataController',
                    windowClass: 'app-modal-window',
                    resolve: {
                        filterObject: function () {
                            return {
                                summary: code
                            };
                        }
                    }
                });
                modalInstance.result.then(function (updatedData) {
                    if (updatedData) {
                        $scope.target.menuIdCha = updatedData;
                    }
                }, function () {

                });
            }

            $scope.checkExistID = function (target) {
                service.checkExistID(target).then(function(reponse){
                    if (reponse.data) {
                        $scope.isExist = true;
                        document.getElementById('menuId').focus();
                    }
                });
            };

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
            $scope.selectedMenu = function(code) {
                service.getMenuForByCode(code).then(function (response) {
                    if (response.data && response.status == 200) {
                        console.log('response', response);
                    }
                    else {
                        $scope.addNewItem(code);
                    }
                });
            };
            $scope.cancel = function () {
                $uibModalInstance.close();
            };
        }]);
    app.controller('selectedDataController', ['$scope', '$location', '$http', 'configService', 'dmmenu_Service', 'tempDataService', '$filter', '$uibModal', '$log', 'securityService', 'toaster', 'ngNotify', '$uibModalInstance', 'filterObject',
        function ($scope, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, securityService, toaster, ngNotify, $uibModalInstance,filterObject) { 
            $scope.config = angular.copy(configService);;
            $scope.paged = angular.copy(configService.pageDefault);
            $scope.filtered = angular.copy(configService.filterDefault);
            $scope.filtered = angular.extend($scope.filtered, filterObject);
            var lstTemp = [];
            $scope.modeClickOneByOne = true;
            $scope.title = function () { return 'Danh sách MENU'; };
            $scope.selecteItem = function (item) {
                $uibModalInstance.close(item);
            }
            $scope.isLoading = false;
            $scope.sortType = 'menuIdCha'; // set the default sort type
            $scope.sortReverse = false;  // set the default sort order
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
            $scope.selectedData = function (data) {
                $uibModalInstance.close(data.menuId);
            }
            $scope.cancel = function () {
                $uibModalInstance.close();
            };
        }
    ]);
    return app;
});
console.log("OK");

