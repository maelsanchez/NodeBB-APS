"use strict";
	/*
		This file shows how client-side javascript can be included via a plugin.
		If you check `plugin.json`, you'll see that this file is listed under "scripts".
		That array tells NodeBB which files to bundle into the minified javascript
		that is served to the end user.

		Some events you can elect to listen for:

		$(document).ready();			Fired when the DOM is ready
		$(window).on('action:ajaxify.end', function(data) { ... });			"data" contains "url"
	*/

	console.log('nodebb-plugin-thad-test: Hello world');
	// Note how this is shown in the console on the first load of every page

/* globals $, require */

$(document).ready(function() {
	function upload(callback) {
		require(['uploader'], function (uploader) {
			uploader.show({
				title: 'Upload Audio',
				description: 'Upload an audio file for embedding into your post',
				route: config.relative_path + '/plugins/nodebb-plugin-aps/upload'
			}, callback);
		});
	}

	$(window).on('action:composer.loaded', function (ev, data) {
		require(['composer/formatting', 'composer/controls'], function(formatting, controls) {
			if (formatting && controls) {
				formatting.addButtonDispatch('audio-embed', function(textarea, selectionStart, selectionEnd){
					upload(function (id) {
						controls.insertIntoTextarea(textarea, '[audio/' + id + ']');
						controls.updateTextareaSelection(textarea, id.length + 8, id.length + 8);
					});
				});
			}
		});

		if ($.Redactor) {
			$.Redactor.opts.plugins.push('audio-embed');
		}
	});

	$(window).on('action:redactor.load', function() {
		$.Redactor.prototype['audio-embed'] = function () {
			return {
				init: function () {
					var self = this;

					// require translator as such because it was undefined without it
					require(['translator'], function (translator) {
						translator.translate('Embed Audio', function (translated) {
							var button = self.button.add('audio-embed', translated);
							self.button.setIcon(button, '<i class="fa fa-file-audio-o"></i>');
							self.button.addCallback(button, self['audio-embed'].onClick);
						});
					});
				},
				onClick: function () {
					var self = this;
					upload(function (id) {
						templates.parse('partials/audio-embed', {
							path: config.relative_path + '/uploads/audio-embed/' + id
						}, function (html) {
							self.insert.html(html);
						});
					});
				}
			};
		};
	});
});