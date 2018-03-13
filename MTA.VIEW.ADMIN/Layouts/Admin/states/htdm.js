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
    ];
    return states;
});