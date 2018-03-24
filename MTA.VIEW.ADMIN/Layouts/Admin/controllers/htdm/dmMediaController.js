define(['ui-bootstrap'], function () {
    'use strict';
    var app = angular.module('dmMediaModule', ['ui.bootstrap']);

    app.factory('dmMediaService', ['$http', 'configService', function ($http, configService) {
        var serviceUrl = configService.rootUrlWebApi + '/DM/Media';
        var result = {
            postQuery: function (postData) {
                return $http.post(serviceUrl + '/postQuery', postData);
            },
            post: function (data) {
                return $http.post(serviceUrl + '/Insert', data);
            },
            getNewInstance: function () {
                return $http.get(serviceUrl + '/getNewInstance');
            },
            getImgForByCodeParent: function (code) {
                return $http.get(serviceUrl + '/GetImgForByCodeParent/' + code);
            },
            deleteAllForCodeParent: function (code) {
                return $http.get(serviceUrl + '/DeleteAllForCodeParent/' + code);
            },
            deleteByCode: function (params) {
                return $http.delete(serviceUrl + '/DeleteItem/' + params.id, params);
            },
            update: function (params) {
                return $http.put(serviceUrl + '/edit/' + params.id, params)
            }
        };
        return result;
    }]);
    app.controller('dmMediaController', ['$scope', '$location', '$http', 'configService', 'dmMediaService', 'tempDataService', '$filter', '$uibModal', '$log', 'securityService', 'toaster', '$sce',
       function ($scope, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, securityService, toaster, $sce) {
           $scope.config = angular.copy(configService);
           $scope.paged = angular.copy(configService.pageDefault);
           $scope.filtered = angular.copy(configService.paramDefault);
           $scope.tempData = tempDataService.tempData;
           $scope.title = function () {
               return 'Media';
           }
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
           }
           filterData();
           $scope.displayHelper = function (module, value) {
               var data = $filter('filter')($scope.tempData(module), { Value: value }, true);
               if (data.length === 1) {
                   return data[0].Text;
               } else {
                   return value;
               }
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
                   templateUrl: configService.buildUrl('htdm/dmMedia', 'addNew'),
                   controller: 'dmMediaCreateController',
                   resolve: {}
               });
               modalInstance.result.then(function (updatedData) {
                   filterData();
               }, function () {
                   $log.info('Modal dismissed at: ' + new Date());
               });
           };

           /* Function Edit Item */
           $scope.update = function (target) {
               var modalInstance = $uibModal.open({
                   backdrop: 'static',
                   templateUrl: configService.buildUrl('htdm/dmMedia', 'edit'),
                   controller: 'dmMediaEditController',
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
                   templateUrl: configService.buildUrl('htdm/dmMedia', 'delete'),
                   controller: 'dmMediaDeleteController',
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
                   templateUrl: configService.buildUrl('htdm/dmMedia', 'details'),
                   controller: 'dmMediaDetailsController',
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
    app.controller('dmMediaCreateController', ['$scope', '$location', '$http', 'configService', 'dmMediaService', 'tempDataService', '$filter', '$uibModal', '$log', 'securityService', 'toaster', 'ngNotify', '$uibModalInstance', 'userService', '$timeout', 'Upload',
        function ($scope, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, securityService, toaster, ngNotify, $uibModalInstance, userService, $timeout, upload) {
            $scope.config = angular.copy(configService);
            $scope.tempData = tempDataService.tempData;
            $scope.target = {};
            $scope.lstFile = [];
            $scope.lstFilesSrc = [];
            $scope.lstImagesSrcFromDb = [];
            $scope.target.ten_Media = [];
            $scope.isLoading = false;
            $scope.title = function () { return 'Thêm mới Media'; };
            $scope.target.ngayTao = new Date();
            $scope.target.manguoitao = userService.GetCurrentUser();
            $scope.target.ten_Media = [];
            $scope.isExist = false;
            $scope.acceptFile = 'image/*';
            $scope.target.flag = '';
            $scope.target.anhBia = [];
            $scope.anh_Bia = [];
            function filterData() {
                service.getNewInstance().then(function (response) {
                    if (response && response.status == 200) {
                        $scope.target.Ma = response.data;
                    }
                });
            }
            filterData();
            $scope.isDisable_btnUpload = false;

            $scope.optionSelect = function (index) {
                if (index == 1) {
                    $scope.acceptFile = 'image/*';
                }
                else if (index == 3) {
                    $scope.acceptFile = 'application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';
                }
                $scope.lstFilesSrc = [];
                $scope.lstFile = [];
            }

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
                            $timeout(function () {
                                var fileReader = new FileReader();
                                fileReader.readAsDataURL(file);
                                fileReader.onload = function (e) {
                                    $timeout(function () {
                                        $scope.lstFilesSrc.push(e.target.result);
                                        if ($scope.target.loai_Media === 1) {
                                            $scope.isDisable_btnUpload = true;
                                        }
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
                $scope.isDisable_btnUpload = false;
                if ($scope.lstFile.length < 1) {
                    angular.element("#file-input-upload").val(null);
                }
            };

            function saveFile() {
                $scope.target.file = $scope.lstFile;
                if ($scope.target.loai_Media == 1) {
                    $scope.target.flag = 'Anh';
                    $scope.target.anhBia = $scope.anh_Bia;
                }
                else {
                    $scope.target.flag = 'Tep';
                }
                upload.upload({
                    url: configService.rootUrlWebApi + '/DM/Media/Upload',
                    data: $scope.target
                }).then(function (response) {
                    if (response.status) {
                        $uibModalInstance.close($scope.target);
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
                else {
                    $scope.target.ma_Dm = $scope.target.Ma;
                    $scope.target.link = $scope.linkVideo;
                    service.post($scope.target).then(function (successRes) {
                        console.log('$scope.target',$scope.target);
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
                }
            };

            $scope.cancel = function () {
                $uibModalInstance.close();
            };
        }]);
    app.controller('dmMediaDetailsController', ['$scope', '$uibModalInstance', '$location', '$http', 'configService', 'dmMediaService', 'tempDataService', '$filter', '$uibModal', '$log', 'ngNotify', 'targetData', '$sce',
        function ($scope, $uibModalInstance, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, ngNotify, targetData, $sce) {
            $scope.config = angular.copy(configService);
            $scope.tempData = tempDataService.tempData;
            $scope.target = angular.copy(targetData);
            $scope.isLoading = false;
            $scope.target.Ma = angular.copy(targetData.ma_Dm);
            $scope.title = function () { return 'Thông tin media'; };

            $scope.cancel = function () {
                $uibModalInstance.close();
            };
        }]);
    app.controller('dmMediaDeleteController', ['$scope', '$uibModalInstance', '$location', '$http', 'configService', 'dmMediaService', 'tempDataService', '$filter', '$uibModal', '$log', 'ngNotify', 'targetData', '$timeout', 'toaster',
       function ($scope, $uibModalInstance, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, ngNotify, targetData, $timeout,toaster) {
           $scope.config = angular.copy(configService);
           $scope.tempData = tempDataService.tempData;
           $scope.target = angular.copy(targetData);
           $scope.save = function () {
               service.deleteByCode($scope.target).then(function (reponse) {
                   if (reponse && reponse.status === 200) {
                       toaster.pop('success', "Thành công:", "Xóa thành công!");
                       $uibModalInstance.close($scope.target);

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
    app.controller('dmMediaEditController', ['$scope', '$uibModalInstance', '$location', '$http', 'configService', 'dmMediaService', 'tempDataService', '$filter', '$uibModal', '$log', 'ngNotify', 'targetData', '$sce','$timeout','Upload',
        function ($scope, $uibModalInstance, $location, $http, configService, service, tempDataService, $filter, $uibModal, $log, ngNotify, targetData, $sce,$timeout,upload) {
            $scope.config = angular.copy(configService);
            $scope.tempData = tempDataService.tempData;
            $scope.target = angular.copy(targetData);
            $scope.lstFile = [];
            $scope.lstFilesSrc = [];
            $scope.isLoading = false;
            $scope.title = function () { return 'Sửa thông tin media'; };
            $scope.target.Ma = angular.copy(targetData.ma_Dm);
            $scope.isDeleted = false;
            var linkTemp = "";           
            console.log('$scope.target', $scope.target);

            if ($scope.target.loai_Media == 1) {
                $scope.acceptFile = 'image/*';
            }
            else if ($scope.target.loai_Media == 3) {
                $scope.acceptFile = 'application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';
            }

            if($scope.target.link!= null && $scope.target.loai_Media != 2){
                $scope.isDisable = true;
            }
            else {
                $scope.isDisable = false;
            }

            if ($scope.target.loai_Media == 2) {
                $scope.linkVideo = $scope.target.link;
            }

            $scope.deleteFile = function () {
                linkTemp = angular.copy($scope.target.link);
                $scope.target.link = null;
                $scope.target.ten_Media = null;
                $scope.target.anhBia = 0;
                $scope.isDeleted = true;
                $scope.isDisable = false;
            }
            
            $scope.cancel = function () {
                $uibModalInstance.close();
            };

            $scope.uploadFile = function (input) {
                if (input.files && input.files.length > 0) {
                    var i = 0;
                    angular.forEach(input.files, function (file) {
                        if (file.size < 3072000) {
                            $scope.lstFile.push(file);
                            $timeout(function () {
                                var fileReader = new FileReader();
                                fileReader.readAsDataURL(file);
                                fileReader.onload = function (e) {
                                    $timeout(function () {
                                        $scope.lstFilesSrc.push(e.target.result);
                                        if ($scope.target.loai_Media === 1) {
                                            $scope.isDisable_btnUpload = true;
                                        }
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

            $scope.deleteFileNew = function (index) {
                $scope.lstFilesSrc.splice(index, 1);
                $scope.lstFile.splice(index, 1);
                $scope.isDisable_btnUpload = false;
                if ($scope.lstFile.length < 1) {
                    angular.element("#file-input-upload").val(null);
                }
            };

            $scope.save = function () {
                if ($scope.target.loai_Media == 2) {
                    $scope.target.ma_Dm = $scope.target.Ma;
                    $scope.target.link = $scope.linkVideo;
                    service.update($scope.target).then(function (successRes) {
                        console.log('successRes', successRes);
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
                }
                else {
                    $scope.target.anhBia = $scope.anhBia
                    $scope.target.link_Old = linkTemp;
                    $scope.target.ma_Dm = $scope.target.Ma;
                    $scope.target.file = $scope.lstFile;
                    if ($scope.target.loai_Media == 1) {
                        $scope.target.flag = 'Anh';
                        if ($scope.target.link_Old != "") {
                            $scope.target.anhBia = $scope.anh_Bia[0];
                        }
                    }
                    else {
                        $scope.target.flag = 'Tep';
                    }

                    upload.upload({
                        url: configService.rootUrlWebApi + '/DM/Media/Update',
                        data: $scope.target
                    }).then(function (response) {
                        if (response.status) {
                            $uibModalInstance.close($scope.target);
                            ngNotify.set(response.data.message, { type: 'success' });
                        }
                        else {
                            toaster.pop('error', "Lỗi:", "Không lưu được file! Có thể đã trùng!");
                        }
                    });
                }
            }

        }]);
    return app;
});