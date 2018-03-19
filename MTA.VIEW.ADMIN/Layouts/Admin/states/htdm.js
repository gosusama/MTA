define([
], function () {
    var layoutUrl = "/Layouts/Admin/views/htdm/";
    var controlUrl = "controllers/htdm/";
    var states = [
		{
		    name: 'Menu',
		    url: '/Menu',
		    parent: 'layout',
		    abstract: false,
		    views: {
		        'viewMain@root': {
		            templateUrl: layoutUrl + "dmmenu/index.html",
		            controller: "dmMenuCtr as ctrl"
		        }
		    },
		    moduleUrl: controlUrl+"dmmenu_ctrl"
		},
        {
            name: 'NguoiDung',
            url: '/NguoiDung',
            parent: 'layout',
            abstract: false,
            views: {
                'viewMain@root': {
                    templateUrl: layoutUrl + "dmNguoiDung/index.html",
                    controller: "dmNguoiDungController as ctrl"
                }
            },
            moduleUrl: controlUrl + "dmNguoiDungController"
        },
        {
            name: 'dmGioiThieu',
            url: '/dmGioiThieu',
            parent: 'layout',
            abstract: false,
            views: {
                'viewMain@root': {
                    templateUrl: layoutUrl + "dmGioiThieu/index.html",
                    controller: "dmGioiThieuController as ctrl"
                }
            },
            moduleUrl: controlUrl + "dmGioiThieuController"
        },
        {
            name: 'NhomQuyen',
            url: '/NhomQuyen',
            parent: 'layout',
            abstract: false,
            views: {
                'viewMain@root': {
                    templateUrl: layoutUrl + "dmNhomQuyen/index.html",
                    controller: "dmNhomQuyenController as ctrl"
                }
            },
            moduleUrl: controlUrl + "dmNhomQuyenController"
        },
        {
            name: 'DanhSachDonVi',
            url: '/DanhSachDonVi',
            parent: 'layout',
            abstract: false,
            views: {
                'viewMain@root': {
                    templateUrl: layoutUrl + "dmDonVi/index.html",
                    controller: "dmDonVi_ctrl as ctrl"
                }
            },
            moduleUrl: controlUrl + "dmDonViController"
        },
        {
            name: 'dmTinTuc',
            url: '/dmTinTuc',
            parent: 'layout',
            abstract: false,
            views: {
                'viewMain@root': {
                    templateUrl: layoutUrl + "dmTinTuc/index.html",
                    controller: "dmTinTucController as ctrl"
                }
            },
            moduleUrl: controlUrl + "dmTinTucController"
        },
        {
            name: 'dmDaoTao',
            url: '/dmDaoTao',
            parent: 'layout',
            abstract: false,
            views: {
                'viewMain@root': {
                    templateUrl: layoutUrl + "dmDaoTao/index.html",
                    controller: "dmDaoTaoController as ctrl"
                }
            },
            moduleUrl: controlUrl + "dmDaoTaoController"
        },
        {
            name: 'dmNghienCuu',
            url: '/NghienCuu',
            parent: 'layout',
            abstract: false,
            views: {
                'viewMain@root': {
                    templateUrl: layoutUrl + "dmNghienCuu/index.html",
                    controller: "dmNghienCuuController as ctrl"
                }
            },
            moduleUrl: controlUrl + "dmNghienCuuController"
        },
    ];
    return states;
});