'use strict';

var Controllers = {};

Controllers.renderAdminPage = function (req, res, next) {
	/*
		Make sure the route matches your path to template exactly.

		If your route was:
			myforum.com/some/complex/route/
		your template should be:
			templates/some/complex/route.tpl
		and you would render it like so:
			res.render('some/complex/route');
	*/

	res.render('admin/plugins/thadTest', {});
};

Controllers.upload = function(req, res, next) {
	var main = module.parent.exports;

	main.processUpload(req.files.files[0], function(err, payload) {
		if (!err) {
			res.json([{
				url: payload.id
			}]);
		} else {
			res.json({
				error: err.message === 'invalid-file-type' ? 'Invalid File Type Uploaded. Please check the file format or extension to ensure it is an audio file.' : 'An unknown error occured'
			});
		}
	});
};

module.exports = Controllers;