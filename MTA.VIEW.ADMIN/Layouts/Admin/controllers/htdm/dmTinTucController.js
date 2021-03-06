﻿define(['ui-bootstrap', 'controllers/htdm/dmMediaController', 'controllers/htdm/dmLoaiTinTucController'], function () {
    'use strict';
    var app = angular.module('dmTinTuc_Module', ['ui.bootstrap', 'dmMediaModule', 'dmLoaiTinTuc_Module', ]);

    app.factory('dmTinTuc_Service', ['$http', 'configService', function ($http, configService) {
        var serviceUrl = configService.rootUrlWebApi + '/DM/TinTuc';
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
            }
        }
        return result;
    }]);
    /* controller list */
    app.controller('dmTinTucController', ['$scope', '$location', '$http', 'configService', 'dmTinTuc_Service', 'tempDataService', '$filter', '$uibModal', '$log', 'securityService', 'toaster',
        function ($scope, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, securityService, toaster) {
            $scope.config = angular.copy(configService);
            $scope.paged = angular.copy(configService.pageDefault);
            $scope.filtered = angular.copy(configService.paramDefault);
            $scope.tempData = tempDataService.tempData;
            console.log('TinTuc');
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
            //    securityService.getAccessList('auTinTuc').then(function (successRes) {
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
                    templateUrl: configService.buildUrl('htdm/dmTinTuc', 'addNew'),
                    controller: 'dmTinTucCreateController',
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
                    templateUrl: configService.buildUrl('htdm/dmTinTuc', 'edit'),
                    controller: 'dmTinTucEditController',
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
                    templateUrl: configService.buildUrl('htdm/dmTinTuc', 'delete'),
                    controller: 'dmTinTucDeleteController',
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
                    templateUrl: configService.buildUrl('htdm/dmTinTuc', 'details'),
                    controller: 'dmTinTucDetailsController',
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

    app.controller('dmTinTucCreateController', ['$scope', '$location', '$http', 'configService', 'dmTinTuc_Service', 'tempDataService', '$filter', '$uibModal', '$log', 'securityService', 'toaster', 'ngNotify', '$uibModalInstance', 'userService', '$timeout', 'Upload', 'dmLoaiTinTuc_Service',
        function ($scope, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, securityService, toaster, ngNotify, $uibModalInstance, userService, $timeout, upload, dmLoaiTinTuc_Service) {
            $scope.config = angular.copy(configService);
            $scope.tempData = tempDataService.tempData;
            $scope.target = {};
            $scope.lstFile = [];
            $scope.lstImagesSrc = [];
            $scope.isLoading = false;
            $scope.title = function () { return 'Thêm mới danh mục tin tức'; };
            $scope.target.ngayTao = new Date();
            $scope.target.manguoitao = userService.GetCurrentUser();
            $scope.target.ten_Media = [];
            function filterData() {
                service.getNewInstance().then(function (response) {
                    if (response && response.status == 200) {
                        $scope.target.ma_Dm = response.data;
                    }
                });
            }
            filterData();
            $scope.selectLoaiTinTuc = function () {
                var modalInstance = $uibModal.open({
                    backdrop: 'static',
                    templateUrl: configService.buildUrl('htdm/dmLoaiTinTuc', 'selectData'),
                    controller: 'dmLoaiTinTucSelectDataController',
                    resolve: {
                        serviceSelectData: function () {
                            return dmLoaiTinTuc_Service;
                        },
                        filterObject: function () {
                            return {
                                advanceData: {
                                    unitCode: $scope.target.unitCode,
                                },
                                isAdvance: true
                            }
                        }
                    }
                });
                modalInstance.result.then(function (updatedData) {
                    if (updatedData != null) {
                        var output = '';
                        angular.forEach(updatedData, function (item, index) {
                            output += item.value + ',';
                        });
                        $scope.target.loai_Dm = output.substring(0, output.length - 1);
                    }
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            }
            $scope.changeMaLoaiTinTuc = function (inputLoaiTinTuc) {
                if (typeof inputLoaiTinTuc != 'undefined' && inputLoaiTinTuc !== '') {
                    dmLoaiTinTuc_Service.filterLoaiTinTuc(inputLoaiTinTuc).then(function (response) {
                        if (response && response.status == 200 && response.data) {
                            $scope.data = response.data;
                            $scope.target.loai_Dm = '';
                            $scope.target.loai_Dm = $scope.data.ma_LoaiTinTuc;
                        }
                        else {
                            // $scope.selectWareHouse();
                        }
                    });
                }
            }
            $scope.listDanhMuc = [
                {
                    value: '0',
                    text: "Tin tức sự kiện"
                },
                {
                    value: '1',
                    text: "Thông báo"
                },
                {
                    value: '2',
                    text: "Tin tức đào tạo"
                },
                {
                    value: '3',
                    text: "Tin tức sinh viên"
                },
                {
                    value: '4',
                    text: "Tin tức tuyển sinh"
                },
                {
                    value: '5',
                    text: "Tin tức sinh viên"
                },
                {
                    value: '6',
                    text: "Tin tức hợp tác"
                }
            ];
            $scope.uploadFile = function (input) {
                console.log(input.files);
                if (input.files && input.files.length > 0) {
                    angular.forEach(input.files, function (file) {
                        if (file.size < 3072000) {
                            $scope.lstFile.push(file);
                            $timeout(function () {
                                var fileReader = new FileReader();
                                fileReader.readAsDataURL(file);
                                fileReader.onload = function (e) {
                                    $timeout(function () {
                                        $scope.lstImagesSrc.push(e.target.result);
                                    });
                                }
                            });
                        }
                        else {
                            ngNotify.set("Kích thước ảnh quá lớn !", { duration: 3000, type: 'error' });
                        }
                    });
                }
            };
            $scope.deleteImage = function (index) {
                $scope.lstImagesSrc.splice(index, 1);
                $scope.lstFile.splice(index, 1);
                if ($scope.lstFile.length < 1) {
                    angular.element("#file-input-upload").val(null);
                }
            };
            function saveImage() {
                $scope.target.file = $scope.lstFile;
                $scope.target.loaiMedia = 0;
                upload.upload({
                    url: configService.rootUrlWebApi + '/DM/Media/UpLoad',
                    data: $scope.target
                }).then(function (response) {
                    if (response.status) {
                    }
                    else {
                        toaster.pop('error', "Lỗi:", "Không lưu được ảnh! Có thể đã trùng!");
                    }
                });
            }
            $scope.save = function () {
                dmLoaiTinTuc_Service.clearSelectData();
                if ($scope.lstFile && $scope.lstFile.length) {
                    saveImage();
                }
                console.log($scope.target);

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
                dmLoaiTinTuc_Service.clearSelectData();
                $uibModalInstance.close();
            };
        }]);

    app.controller('dmTinTucDetailsController', ['$scope', '$uibModalInstance', '$location', '$http', 'configService', 'dmTinTuc_Service', 'tempDataService', '$filter', '$uibModal', '$log', 'ngNotify', 'targetData', 'dmMediaService', '$sce',
        function ($scope, $uibModalInstance, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, ngNotify, targetData, dmMediaService, $sce) {
            $scope.config = angular.copy(configService);
            $scope.tempData = tempDataService.tempData;
            $scope.target = angular.copy(targetData);
            console.log('$scope.target', $scope.target);
            $scope.isLoading = false;
            function filterData() {
                dmMediaService.getImgForByCodeParent($scope.target.ma_Dm).then(function (response) {
                    console.log('response', response);
                    if (response.data && response.status == 200) {
                        $scope.lstImagesSrc = response.data;
                    }
                });
            };
            $scope.listDanhMuc = [
                {
                    value: '0',
                    text: "Tin tức sự kiện"
                },
                {
                    value: '1',
                    text: "Thông báo"
                },
                {
                    value: '2',
                    text: "Tin tức đào tạo"
                },
                {
                    value: '3',
                    text: "Tin tức sinh viên"
                },
                {
                    value: '4',
                    text: "Tin tức tuyển sinh"
                },
                {
                    value: '5',
                    text: "Tin tức sinh viên"
                },
                {
                    value: '6',
                    text: "Tin tức hợp tác"
                }
            ];
            $scope.trustAsHtml = function (string) {
                return $sce.trustAsHtml(string);
            };
            filterData();
            $scope.title = function () { return 'Thông tin danh mục tin tức'; };
            $scope.cancel = function () {
                $uibModalInstance.close();
            };
        }]);

    app.controller('dmTinTucEditController', ['$scope', '$uibModalInstance', '$location', '$http', 'configService', 'dmTinTuc_Service', 'tempDataService', '$filter', '$uibModal', '$log', 'ngNotify', 'targetData', 'dmMediaService', '$timeout', 'Upload', 'dmLoaiTinTuc_Service',
    function ($scope, $uibModalInstance, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, ngNotify, targetData, dmMediaService, $timeout, upload, dmLoaiTinTuc_Service) {
        $scope.config = angular.copy(configService);
        $scope.tempData = tempDataService.tempData;
        $scope.target = angular.copy(targetData);
        $scope.isLoading = false;
        $scope.lstFile = [];
        $scope.lstImagesSrc = [];
        $scope.lstImages = [];
        var temp = {};
        $scope.isEdit = false;
        $scope.title = function () { return 'Cập nhật danh mục tin tức'; };
        $scope.selectLoaiTinTuc = function () {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: configService.buildUrl('htdm/dmLoaiTinTuc', 'selectData'),
                controller: 'dmLoaiTinTucSelectDataController',
                resolve: {
                    serviceSelectData: function () {
                        return dmLoaiTinTuc_Service;
                    },
                    filterObject: function () {
                        return {
                            advanceData: {
                                unitCode: $scope.target.unitCode,
                            },
                            isAdvance: true
                        }
                    }
                }
            });
            modalInstance.result.then(function (updatedData) {
                if (updatedData != null) {
                    var output = '';
                    angular.forEach(updatedData, function (item, index) {
                        output += item.value + ',';
                    });
                    $scope.target.loai_Dm = output.substring(0, output.length - 1);
                }
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }
        $scope.changeMaLoaiTinTuc = function (inputLoaiTinTuc) {
            if (typeof inputLoaiTinTuc != 'undefined' && inputLoaiTinTuc !== '') {
                dmLoaiTinTuc_Service.filterLoaiTinTuc(inputLoaiTinTuc).then(function (response) {
                    if (response && response.status == 200 && response.data) {
                        $scope.data = response.data;
                        $scope.target.loai_Dm = '';
                        $scope.target.loai_Dm = $scope.data.ma_LoaiTinTuc;
                    }
                    else {
                        // $scope.selectWareHouse();
                    }
                });
            }
        }
        function filterData() {
            dmMediaService.getImgForByCodeParent($scope.target.ma_Dm).then(function (response) {
                console.log('response', response);
                if (response.data && response.status == 200) {
                    $scope.lstImages = angular.copy(response.data);
                    $scope.temp = angular.copy(response.data);
                }
            });
        }
        filterData();
        $scope.uploadFile = function (input) {
            $scope.isEdit = true;
            if (input.files && input.files.length > 0) {
                angular.forEach(input.files, function (file) {
                    if (file.size < 3072000) {
                        $scope.lstFile.push(file);
                        $timeout(function () {
                            var fileReader = new FileReader();
                            fileReader.readAsDataURL(file);
                            fileReader.onload = function (e) {
                                $timeout(function () {
                                    $scope.lstImagesSrc.push(e.target.result);
                                });
                            }
                        });
                    }
                    else {
                        ngNotify.set("Kích thước ảnh quá lớn !", { duration: 3000, type: 'error' });
                    }
                });
            }
        };
        $scope.deleteImage = function (index) {
            $scope.lstImagesSrc.splice(index, 1);
            $scope.lstFile.splice(index, 1);
            if ($scope.lstFile.length < 1) {
                angular.element("#file-input-upload").val(null);
            }
        };
        $scope.deleteImageOld = function (index) {
            temp = $scope.lstImages[index].ma_Dm;
            $scope.lstImages.splice(index, 1);
        };
        function saveImage() {
            $scope.target.file = $scope.lstFile;
            $scope.target.loaiMedia = 0;
            upload.upload({
                url: configService.rootUrlWebApi + '/NV/Media/UpLoad',
                data: $scope.target
            }).then(function (response) {
                if (response.status) {
                }
                else {
                    toaster.pop('error', "Lỗi:", "Không lưu được ảnh! Có thể đã trùng!");
                }
            });
        }
        $scope.save = function () {
            dmLoaiTinTuc_Service.clearSelectData();
            if ($scope.temp.length != $scope.lstImages.length) {
                dmMediaService.deleteByCode(temp).then(function (res) {
                    if (res && res.status === 200) {
                        saveImage();
                    }
                });
            }
            else {
                saveImage();
            }

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
            dmLoaiTinTuc_Service.clearSelectData();
            $uibModalInstance.close();
        };
    }]);

    app.controller('dmTinTucDeleteController', ['$scope', '$uibModalInstance', '$location', '$http', 'configService', 'dmTinTuc_Service', 'tempDataService', '$filter', '$uibModal', '$log', 'targetData', 'ngNotify', 'dmMediaService',
    function ($scope, $uibModalInstance, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, targetData, ngNotify, dmMediaService) {
        $scope.config = angular.copy(configService);
        $scope.target = angular.copy(targetData);
        $scope.isLoading = false;
        $scope.title = function () { return 'Xoá tin tức'; };
        $scope.save = function () {
            service.deleteItem($scope.target).then(function (reponse) {
                if (reponse && reponse.status === 200) {
                    dmMediaService.deleteAllForCodeParent($scope.target.ma_Dm).then(function (res) {
                        if (res && res.status === 200) {
                            ngNotify.set('Xóa thành công', { type: 'success' });
                            $uibModalInstance.close($scope.target);
                        }
                    });

                } else {
                    ngNotify.set(reponse.data.message, { duration: 3000, type: 'error' });
                }
            },
                 function (errorRes) {
                     console.log('errorRes', errorRes);
                 });
        }
        $scope.cancel = function () {
            $uibModalInstance.close();
        };

    }]);
    return app;
});