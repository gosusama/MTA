define([
], function () {
    var layoutUrl = "/Layouts/Admin/views/nv/";
    var controlUrl = "controllers/nv/";
    var states = [
        {
            name: 'nvTuyenSinh',
            url: '/nvTuyenSinh',
            parent: 'layout',
            abstract: false,
            views: {
                'viewMain@root': {
                    templateUrl: layoutUrl + "nvTuyenSinh/index.html",
                    controller: "nvTuyenSinhController as ctrl"
                }
            },
            moduleUrl: controlUrl + "nvTuyenSinhController"
        },
    ];
    return states;
});