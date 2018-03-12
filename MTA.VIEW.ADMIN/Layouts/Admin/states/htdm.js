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
    ];
    return states;
});