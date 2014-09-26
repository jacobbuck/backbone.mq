(function (context, factory) {
	if (typeof define === 'function' && define.amd) {
		define(['backbone', 'underscore'], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(require('backbone'), require('underscore'));
	} else {
		factory(context.Backbone, context._);
	}
}(this, function (Backbone, _) {
	'use strict';

	var matchMedia = window.matchMedia;

	// Detect matchMedia and CSS3 Media Query support
	var supports = matchMedia && matchMedia('only all').matches;

	function MQ () {
		// Registered media queries
		this._media = {};
		// Run add if arguments supplied on initialize
		if (arguments.length > 0) {
			this.add.apply(this, arguments);
		}
	}

	_.extend(MQ.prototype, Backbone.Events, {
		// Add media query
		add: function (name, mediaQueryString) {
			// When the first argument to be an object, loop through the properties
			if (_.isObject(name)) {
				for (var i in name) {
					this.add(i, name[i]);
				}
				return this;
			}

			// Throw an error if the media query already exists.
			if (this._media[name]) {
				throw new Error('"' + name + '" is already registered');
			}

			// Registered media object
			var media = this._media[name] = {s: mediaQueryString};

			if (supports) {
				media.m = matchMedia(mediaQueryString);
				media.l = _.bind(function () {
					var matches = media.m.matches;
					// Trigger name and name:match|unmatch
					this.trigger(name + ' ' + name + (matches ? ':match' : ':unmatch'),
						{matches: matches, media: media.s});
				}, this);
				media.m.addListener(media.l);
			}

			// Use this as the fallback media query if one hasn't been set
			if (!this.fallback) {
				this.fallback = name;
			}

			return this;
		},

		// Remove media query
		remove: function (name) {
			var media = this._media[name];
			if (media) {
				if (supports) {
					// Remove event handler
					media.m.removeListener(media.l);
				}
				// Remove from registered media queries
				this._media[name] = undefined;
			}
			return this;
		},

		// Return whether the selected media query currently matches
		matches: function (name, callback) {
			var media = this._media[name];
			var matches = (media || undefined) && (supports ? media.m.matches : name === this.fallback);
			if (_.isFunction(callback)) {
				if (matches) {
					callback({matches: matches, media: media.s});
				}
				return this;
			}
			return matches;
		}
	});

	return (Backbone.MQ = MQ);
}));
