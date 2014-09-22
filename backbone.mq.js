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
			// When the first argument to be an object, loop through the properties.
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

			// Registerd media object
			var media = this._media[name] = {m: window.matchMedia(mediaQueryString)};

			// Add event handler
			media.m.addListener(media.l = _.bind(function (m) {
				// Trigger name and name:match|unmatch
				this.trigger(name + ' ' + name + (m.matches ? ':match' : ':unmatch'), m);
			}, this, media.m));

			return this;
		},

		// Remove media query
		remove: function (name) {
			var media = this._media[name];
			if (media) {
				// Remove event handler
				media.m.removeListener(media.l);
				// Remove from registered media queries.
				this._media[name] = undefined;
			}
			return this;
		},

		// Return whether the selected media query currently matches
		matches: function (name, callback) {
			var media = this._media[name];
			if (_.isFunction(callback)) {
				if (media && media.m.matches) {
					callback(media.m);
				}
				return this;
			}
			return (media || undefined) && media.m.matches;
		}
	});

	return (Backbone.MQ = MQ);
}));

/*

// # Usage

var mq = new Backbone.MQ();

// Add a media query
mq.add('desktop', 'only screen and (min-width: 600px)');

// Add muliple media queries
mq.add({
	'desktop': 'only screen and (min-width: 600px)',
	// ...
});

// Remove a media query
mq.remove('desktop');

// Listen to a breakpoint
mq.on('desktop:match', function (mql) {
	// ...
});
// or with Backbone objects
model.listenTo(mq, 'desktop:match', function (mql) {
	// ...
});

// Detect if a media query matches
var matches = mq.matches('desktop'); // Boolean
if (matches) {
	// ...
}
// or
mq.matches('desktop', function (mql) {
	// ...
});

// Chainable
mq.add('mobile', 'handheld or (max-width: 600px)').on('mobile', someFn); // ...

*/
