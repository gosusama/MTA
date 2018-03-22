define(['ui-bootstrap', 'controllers/nv/mediaController'], function () {
    'use strict';
    var app = angular.module('dmDaoTao_Module', ['ui.bootstrap', 'mediaModule']);

    app.factory('dmDaoTao_Service', ['$http', 'configService', function ($http, configService) {
        var serviceUrl = configService.rootUrlWebApi + '/DM/DaoTao';
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
    app.controller('dmDaoTaoController', ['$scope', '$location', '$http', 'configService', 'dmDaoTao_Service', 'tempDataService', '$filter', '$uibModal', '$log', 'securityService', 'toaster',
        function ($scope, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, securityService, toaster) {
            $scope.config = angular.copy(configService);
            $scope.paged = angular.copy(configService.pageDefault);
            $scope.filtered = angular.copy(configService.paramDefault);
            $scope.tempData = tempDataService.tempData;
            console.log('DaoTao');
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
            //    securityService.getAccessList('auDaoTao').then(function (successRes) {
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
                    templateUrl: configService.buildUrl('htdm/dmDaoTao', 'addNew'),
                    controller: 'dmDaoTaoCreateController',
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
                    templateUrl: configService.buildUrl('htdm/dmDaoTao', 'edit'),
                    controller: 'dmDaoTaoEditController',
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
                    templateUrl: configService.buildUrl('htdm/dmDaoTao', 'delete'),
                    controller: 'dmDaoTaoDeleteController',
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
                    templateUrl: configService.buildUrl('htdm/dmDaoTao', 'details'),
                    controller: 'dmDaoTaoDetailsController',
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

    app.controller('dmDaoTaoCreateController', ['$scope', '$location', '$http', 'configService', 'dmDaoTao_Service', 'tempDataService', '$filter', '$uibModal', '$log', 'securityService', 'toaster', 'ngNotify', '$uibModalInstance', 'userService', '$timeout', 'Upload',
        function ($scope, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, securityService, toaster, ngNotify, $uibModalInstance, userService, $timeout, upload) {
            $scope.config = angular.copy(configService);
            $scope.tempData = tempDataService.tempData;
            $scope.target = {};
            $scope.lstFile = [];
            $scope.lstImagesSrc = [];
            $scope.isLoading = false;
            $scope.title = function () { return 'Thêm mới danh mục đào tạo'; };
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

            $scope.listDanhMuc = [
                {
                    value: "0",
                    text: "Đào tạo hệ quân sự"
                },
                {
                    value: "1",
                    text: "Đào tạo hệ dân sự"
                },
                {
                    value: "2",
                    text: "Đào tạo sau đại học"
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

    app.controller('dmDaoTaoDetailsController', ['$scope', '$uibModalInstance', '$location', '$http', 'configService', 'dmDaoTao_Service', 'tempDataService', '$filter', '$uibModal', '$log', 'ngNotify', 'targetData', 'mediaService', '$sce',
        function ($scope, $uibModalInstance, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, ngNotify, targetData, mediaService, $sce) {
            $scope.config = angular.copy(configService);
            $scope.tempData = tempDataService.tempData;
            $scope.target = angular.copy(targetData);
            $scope.isLoading = false;
            $scope.title = function () { return 'Thông tin danh mục đào tạo'; };
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
                    value: "0",
                    text: "Đào tạo hệ quân sự"
                },
                {
                    value: "1",
                    text: "Đào tạo hệ dân sự"
                },
                {
                    value: "2",
                    text: "Đào tạo sau đại học"
                }
            ];
            $scope.trustAsHtml = function (string) {
                return $sce.trustAsHtml(string);
            };
            filterData();
            $scope.cancel = function () {
                $uibModalInstance.close();
            };
        }]);

    app.controller('dmDaoTaoEditController', ['$scope', '$uibModalInstance', '$location', '$http', 'configService', 'dmDaoTao_Service', 'tempDataService', '$filter', '$uibModal', '$log', 'ngNotify', 'targetData', 'mediaService', 'Upload', '$timeout',
    function ($scope, $uibModalInstance, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, ngNotify, targetData, mediaService, upload, $timeout) {
        $scope.config = angular.copy(configService);
        $scope.tempData = tempDataService.tempData;
        $scope.target = angular.copy(targetData);
        $scope.isLoading = false;
        $scope.lstFile = [];
        $scope.lstImagesSrc = [];
        $scope.lstImages = [];
        $scope.isEdit = false;
        var temp = {};
        $scope.title = function () { return 'Cập nhật danh mục đào tạo'; };
        function filterData() {
            mediaService.getImgForByCodeParent($scope.target.ma_Dm).then(function (response) {
                console.log('response', response);
                if (response.data && response.status == 200) {
                    $scope.lstImages = angular.copy(response.data);
                    $scope.temp = angular.copy(response.data);
                }
            });
        }
        $scope.listDanhMuc = [
                {
                    value: "0",
                    text: "Đào tạo hệ quân sự"
                },
                {
                    value: "1",
                    text: "Đào tạo hệ dân sự"
                },
                {
                    value: "2",
                    text: "Đào tạo sau đại học"
                }
        ];
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

    app.controller('dmDaoTaoDeleteController', ['$scope', '$uibModalInstance', '$location', '$http', 'configService', 'dmDaoTao_Service', 'tempDataService', '$filter', '$uibModal', '$log', 'targetData', 'ngNotify', 'mediaService',
    function ($scope, $uibModalInstance, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, targetData, ngNotify, mediaService) {
        $scope.config = angular.copy(configService);
        $scope.target = angular.copy(targetData);
        $scope.isLoading = false;
        $scope.title = function () { return 'Xoá đào tạo'; };
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