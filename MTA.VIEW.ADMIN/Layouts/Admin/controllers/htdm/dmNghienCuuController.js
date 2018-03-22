define(['ui-bootstrap', 'controllers/htdm/dmMediaController'], function () {
    'use strict';
    var app = angular.module('dmNghienCuuModule', ['ui.bootstrap', 'dmMediaModule']);
    app.factory('dmNghienCuuService', ['$http', 'configService', function ($http, configService) {
        var serviceUrl = configService.rootUrlWebApi + '/DM/NghienCuu';
        var result = {
            postQuery: function (params) {
                return $http.post(serviceUrl + '/PostQuery', params);
            },
            post: function (data) {
                return $http.post(serviceUrl + '/Insert', data);
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
            checkExistByCodeParent: function (code) {
                return $http.get(serviceUrl + '/checkExist/' + code);
            }
        };
        return result;
    }]);

    app.controller('dmNghienCuuController', ['$scope', '$location', '$http', 'configService', 'dmNghienCuuService', 'tempDataService', '$filter', '$uibModal', '$log', 'securityService', 'toaster', '$state','$sce',
        function ($scope, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, securityService, toaster, $state,$sce) {
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
                        console.log('$scope.data',$scope.data);
                        angular.extend($scope.paged, successRes.data.data);
                    }
                }, function (errorRes) {
                    console.log(errorRes);
                });
            }

            function loadAccessList() {
                securityService.getAccessList('dmNghienCuu').then(function (successRes) {
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

            $scope.trustAsHtml = function (string) {
                return $sce.trustAsHtml(string);
            };

            /* Function Edit Item */
            $scope.update = function (target) {
                var modalInstance = $uibModal.open({
                    backdrop: 'static',
                    templateUrl: configService.buildUrl('htdm/dmNghienCuu', 'edit'),
                    controller: 'dmNghienCuuEditController',
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
                    templateUrl: configService.buildUrl('htdm/dmNghienCuu', 'delete'),
                    controller: 'dmNghienCuuDeleteController',
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
                    templateUrl: configService.buildUrl('htdm/dmNghienCuu', 'details'),
                    controller: 'dmNghienCuuDetailsController',
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
            $scope.lstFilesSrc = [];
            $scope.lstImagesSrcFromDb = [];
            $scope.target.ten_Media = [];
            $scope.isLoading = false;
            $scope.title = function () { return 'Thêm mới danh mục nghiên cứu'; };
            $scope.target.ngayTao = new Date();
            $scope.target.manguoitao = userService.GetCurrentUser();
            $scope.target.ten_Media = [];
            $scope.isExist = false;
            function filterData() {
                service.getNewInstance().then(function (response) {
                    if (response && response.status == 200) {
                        $scope.target.ma_Dm = response.data;
                    }
                });
            }
            filterData();

            $scope.checkExist = function (code) {
                if (code == "" || code == null) {
                    $scope.isExist = false;
                    
                }
                else {
                    service.checkExistByCodeParent(code).then(function (response) {
                        if (response.status === 200 && response.data == false) {
                            $scope.isExist = true;
                            document.getElementById('maCha').focus();
                        } else {
                            $scope.isExist = false;
                        }
                    });
                }
            }

            $scope.uploadFile = function (input) {
                console.log(input.files);
                if (input.files && input.files.length > 0) {
                    var i = 0;
                    angular.forEach(input.files, function (file) {
                        if (file.size < 3072000) {
                            $scope.lstFile.push(file);
                            $scope.target.ten_Media[i++] = file.name;
                            $timeout(function () {
                                var fileReader = new FileReader();
                                fileReader.readAsDataURL(file);
                                fileReader.onload = function (e) {
                                    $timeout(function () {
                                        $scope.lstFilesSrc.push(e.target.result);
                                    });
                                }
                            });
                        }
                        else {
                            ngNotify.set("Kích thước file quá lớn !", { duration: 3000, type: 'error' });
                        }
                    });
                }
            };

            $scope.deleteFile = function (index) {
                $scope.lstFilesSrc.splice(index, 1);
                $scope.lstFile.splice(index, 1);
                if ($scope.lstFile.length < 1) {
                    angular.element("#file-input-upload").val(null);
                }
            };

            function saveFile() {
                $scope.target.file = $scope.lstFile;
                $scope.target.loai_Media == 3;
                $scope.target.flag = 'Tep';
                upload.upload({
                    url: configService.rootUrlWebApi + '/DM/Media/Upload',
                    data: $scope.target
                }).then(function (response) {
                    if (response.status) {
                    }
                    else {
                        toaster.pop('error', "Lỗi:", "Không lưu được file! Có thể đã trùng!");
                    }
                });
            }

            $scope.save = function () {
                if ($scope.lstFile && $scope.lstFile.length) {
                    saveFile();
                }
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
    app.controller('dmNghienCuuDetailsController', ['$scope', '$uibModalInstance', '$location', '$http', 'configService', 'dmNghienCuuService', 'tempDataService', '$filter', '$uibModal', '$log', 'ngNotify', 'targetData', '$sce', 'dmMediaService',
        function ($scope, $uibModalInstance, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, ngNotify, targetData, $sce , mediaService) {
            $scope.config = angular.copy(configService);
            $scope.tempData = tempDataService.tempData;
            $scope.target = angular.copy(targetData);
            $scope.isLoading = false;
            $scope.title = function () { return 'Thông tin danh mục giới thiệu'; };
            function filterData() {
                mediaService.getImgForByCodeParent($scope.target.ma_Dm).then(function (response) {
                    if (response.data && response.status == 200) {
                        $scope.lstFilesSrc = response.data;
                    }
                });
            };

            $scope.trustAsHtml = function (string) {
                return $sce.trustAsHtml(string);
            };
            filterData();

            $scope.cancel = function () {
                $uibModalInstance.close();
            };
        }]);

    app.controller('dmNghienCuuDeleteController', ['$scope', '$uibModalInstance', '$location', '$http', 'configService', 'dmNghienCuuService', 'tempDataService', '$filter', '$uibModal', '$log', 'ngNotify', 'targetData', 'dmMediaService', '$timeout',
       function ($scope, $uibModalInstance, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, ngNotify, targetData, mediaService, $timeout) {
           $scope.config = angular.copy(configService);
           $scope.tempData = tempDataService.tempData;
           $scope.target = angular.copy(targetData);
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

    app.controller('dmNghienCuuEditController', ['$scope', '$uibModalInstance', '$location', '$http', 'configService', 'dmNghienCuuService', 'tempDataService', '$filter', '$uibModal', '$log', 'ngNotify', 'targetData', 'dmMediaService', 'Upload', '$timeout',
    function ($scope, $uibModalInstance, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, ngNotify, targetData, mediaService, upload, $timeout) {
        $scope.config = angular.copy(configService);
        $scope.tempData = tempDataService.tempData;
        $scope.target = angular.copy(targetData);
        $scope.isLoading = false;
        $scope.lstFile = [];
        $scope.lstFilesSrc = [];
        $scope.lstFiles = [];
        $scope.isEdit = false;
        $scope.target.ten_Media = [];
        $scope.title = function () { return 'Cập nhật danh mục giới thiệu'; };
        $scope.temp = [];
        function filterData() {
            mediaService.getImgForByCodeParent($scope.target.ma_Dm).then(function (response) {
                console.log('response', response);
                if (response.data && response.status == 200) {
                    $scope.lstFiles = angular.copy(response.data);
                    //console.log(lstFiles);
                    $scope.temp = angular.copy(response.data);
                }
            });
        }
        filterData();

        $scope.checkExist = function (code) {
            if (code != "") {
                service.checkExistByCodeParent(code).then(function (response) {
                    if (response.status === 200 && response.data == false) {
                        $scope.isExist = true;
                        document.getElementById('maCha').focus();
                    } else {
                        $scope.isExist = false;
                    }
                });
            }
            else {
                $scope.isExist = false;
            }
        }

        $scope.uploadFile = function (input) {
            $scope.isEdit = true;
            var i = 0;
            if (input.files && input.files.length > 0) {
                angular.forEach(input.files, function (file) {
                    if (file.size < 3072000) {
                        $scope.lstFile.push(file);
                        console.log($scope.lstFile);
                        $scope.target.ten_Media[i++] = file.name;
                        $timeout(function () {
                            var fileReader = new FileReader();
                            fileReader.readAsDataURL(file);
                            fileReader.onload = function (e) {
                                $timeout(function () {
                                    $scope.lstFilesSrc.push(e.target.result);
                                });
                            }
                        });
                    }
                    else {
                        ngNotify.set("Kích thước file quá lớn !", { duration: 3000, type: 'error' });
                    }
                });
            }
        };

        $scope.deleteFileOld = function (index) {
            $scope.lstFiles.splice(index, 1);
            if ($scope.lstFile.length < 1) {
                angular.element("#file-input-upload").val(null);
            }
        };

        $scope.deleteFile = function (index) {
            $scope.lstFilesSrc.splice(index, 1);
            $scope.lstFile.splice(index, 1);
            if ($scope.lstFile.length < 1) {
                angular.element("#file-input-upload").val(null);
            }
        };
        function saveFile() {
            $scope.target.file = $scope.lstFile;
            $scope.target.loai_Media == 3;
            $scope.target.flag = 'Tep';
            upload.upload({
                url: configService.rootUrlWebApi + '/DM/Media/Upload',
                data: $scope.target
            }).then(function (response) {
                if (response.status) {
                }
                else {
                    toaster.pop('error', "Lỗi:", "Không lưu được file! Có thể đã trùng!");
                }
            });
        }

        $scope.save = function () {
            if ($scope.lstFile && $scope.lstFile.length) {
                if (angular.equals($scope.temp, $scope.lstFiles)) {
                    saveFile();
                }
                else {
                    mediaService.deleteAllForCodeParent($scope.target.ma_Dm).then(function (res) {
                        if (res && res.status === 200) {
                            saveFile();
                        }
                    });
                }
            }
            service.update($scope.target).then(function (successRes) {
                if (successRes && successRes.status === 200 && successRes.data.status) {
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

    return app;
});