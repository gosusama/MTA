/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	config.language = 'vi';
	config.toolbarCanCollapse = true;
	config.extraPlugins = 'uploadimage';
	config.filebrowserBrowseUrl= '/Layouts/Admin/utils/ckfinder/ckfinder.html';
	config.filebrowserUploadUrl = '/Layouts/Admin/utils/ckfinder/core/connector/aspx/connector.aspx?command=QuickUpload&type=Files';
    config.filebrowserWindowWidth= '1000';
    config.filebrowserWindowHeight= '700';
};
