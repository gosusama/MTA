﻿define(['ui-bootstrap', 'controllers/nv/mediaController'], function () {
    'use strict';
    var app = angular.module('nvTuyenSinh_Module', ['ui.bootstrap', 'mediaModule']);

    app.factory('nvTuyenSinh_Service', ['$http', 'configService', function ($http, configService) {
        var serviceUrl = configService.rootUrlWebApi + '/NV/TuyenSinh';
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
    app.controller('nvTuyenSinhController', ['$scope', '$location', '$http', 'configService', 'nvTuyenSinh_Service', 'tempDataService', '$filter', '$uibModal', '$log', 'securityService', 'toaster',
        function ($scope, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, securityService, toaster) {
            $scope.config = angular.copy(configService);
            $scope.paged = angular.copy(configService.pageDefault);
            $scope.filtered = angular.copy(configService.paramDefault);
            $scope.tempData = tempDataService.tempData;
            console.log('TuyenSinh');
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
            //    securityService.getAccessList('auTuyenSinh').then(function (successRes) {
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
                    templateUrl: configService.buildUrl('htdm/nvTuyenSinh', 'addNew'),
                    controller: 'nvTuyenSinhCreateController',
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
                    templateUrl: configService.buildUrl('htdm/nvTuyenSinh', 'edit'),
                    controller: 'nvTuyenSinhEditController',
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
                    templateUrl: configService.buildUrl('htdm/nvTuyenSinh', 'delete'),
                    controller: 'nvTuyenSinhDeleteController',
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
                    templateUrl: configService.buildUrl('htdm/nvTuyenSinh', 'details'),
                    controller: 'nvTuyenSinhDetailsController',
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

    app.controller('nvTuyenSinhCreateController', ['$scope', '$location', '$http', 'configService', 'nvTuyenSinh_Service', 'tempDataService', '$filter', '$uibModal', '$log', 'securityService', 'toaster', 'ngNotify', '$uibModalInstance', 'userService', '$timeout', 'Upload',
        function ($scope, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, securityService, toaster, ngNotify, $uibModalInstance, userService, $timeout, upload) {
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
            $scope.target.loai_Dm = "-1";
            function filterData() {
                service.getNewInstance().then(function (response) {
                    if (response && response.status == 200) {
                        $scope.target.ma_Dm = response.data;
                    }
                });
            }
            filterData();
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
                $uibModalInstance.close();
            };
        }]);

    app.controller('nvTuyenSinhDetailsController', ['$scope', '$uibModalInstance', '$location', '$http', 'configService', 'nvTuyenSinh_Service', 'tempDataService', '$filter', '$uibModal', '$log', 'ngNotify', 'targetData', 'mediaService', '$sce',
        function ($scope, $uibModalInstance, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, ngNotify, targetData, mediaService, $sce) {
            $scope.config = angular.copy(configService);
            $scope.tempData = tempDataService.tempData;
            $scope.target = angular.copy(targetData);
            console.log('$scope.target', $scope.target);
            $scope.isLoading = false;
            function filterData() {
                mediaService.getImgForByCodeParent($scope.target.ma_Dm).then(function (response) {
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

    app.controller('nvTuyenSinhEditController', ['$scope', '$uibModalInstance', '$location', '$http', 'configService', 'nvTuyenSinh_Service', 'tempDataService', '$filter', '$uibModal', '$log', 'ngNotify', 'targetData', 'mediaService', '$timeout', 'Upload',
    function ($scope, $uibModalInstance, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, ngNotify, targetData, mediaService, $timeout, upload) {
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
        function filterData() {
            mediaService.getImgForByCodeParent($scope.target.ma_Dm).then(function (response) {
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
            console.log('$scope.lstFile.length', $scope.lstFile.length);
            if ($scope.temp.length != $scope.lstImages.length) {
                mediaService.deleteByCode(temp).then(function (res) {
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
            $uibModalInstance.close();
        };
    }]);

    app.controller('nvTuyenSinhDeleteController', ['$scope', '$uibModalInstance', '$location', '$http', 'configService', 'nvTuyenSinh_Service', 'tempDataService', '$filter', '$uibModal', '$log', 'targetData', 'ngNotify', 'mediaService',
    function ($scope, $uibModalInstance, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, targetData, ngNotify, mediaService) {
        $scope.config = angular.copy(configService);
        $scope.target = angular.copy(targetData);
        $scope.isLoading = false;
        $scope.title = function () { return 'Xoá tin tức'; };
        $scope.save = function () {
            service.deleteItem($scope.target).then(function (reponse) {
                if (reponse && reponse.status === 200) {
                    mediaService.deleteAllForCodeParent($scope.target.ma_Dm).then(function (res) {
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