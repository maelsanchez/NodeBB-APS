"use strict";
/* globals require, module */

var path = require('path'),
    fs = require('fs'),
    mkdirp = require('mkdirp'),
    mv = require('mv'),
    async = require('async'),
    nconf = require.main.require('nconf');

var controllers = require('./lib/controllers'),
	plugin = {};

plugin.init = function(params, callback) {
	var router = params.router,
		hostMiddleware = params.middleware,
		multiparty = require.main.require('connect-multiparty')(),
		hostControllers = params.controllers;
		
	// We create two routes for every view. One API call, and the actual route itself.
	// Just add the buildHeader middleware to your route and NodeBB will take care of everything for you.	
	router.get('/admin/plugins/quickstart', hostMiddleware.admin.buildHeader, controllers.renderAdminPage);
	router.get('/api/admin/plugins/thadTest', controllers.renderAdminPage);
	router.post('/plugins/nodebb-plugin-aps/upload', multiparty, hostMiddleware.validateFiles, hostMiddleware.applyCSRF, controllers.upload);

	// Create "replays/aom" subfolder into upload_path
	mkdirp(path.join(nconf.get('upload_path'), 'replays/aom'), callback);
	
	//callback();
};

plugin.addAdminNavigation = function(header, callback) {
	header.plugins.push({
		route: '/plugins/thadTest',
		icon: 'fa-tint',
		name: 'Thad Test'
	});

	callback(null, header);
};

plugin.processUpload = function(payload, callback) {
	console.log(payload);
    /*if (payload.type.startsWith('audio/')) {
        var id = path.basename(payload.path),
            uploadPath = path.join(nconf.get('upload_path'), 'audio-embed', id);

        async.waterfall([
            async.apply(mv, payload.path, uploadPath),
            async.apply(db.setObject, 'audio-embed:id:' + id, {
                name: payload.name,
                size: payload.size
            }),
            async.apply(db.sortedSetAdd, 'audio-embed:date', +new Date(), id)
        ], function(err) {
            if (err) {
                return callback(err);
            }

            callback(null, {
                id: id
            });
        });
    } else {
        callback(new Error('invalid-file-type'));
    }*/
};

module.exports = plugin;