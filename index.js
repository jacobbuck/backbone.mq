'use strict';

var Backbone = require('backbone');
var assign = require('lodash/assign');

var matchMedia = window.matchMedia;

// Detect matchMedia and CSS3 Media Query support
var supports = matchMedia && matchMedia('only all').matches;

function MQ() {
  // Registered media queries
  this._media = {};
  // Run add if arguments supplied on initialize
  if (arguments.length > 0) {
    this.add.apply(this, arguments);
  }
}

assign(MQ.prototype, Backbone.Events, {
  // Add media query
  add: function(name, mediaQueryString) {
    // When the first argument to be an object, loop through the properties
    if (typeof name === 'object') {
      for (var i in name) {
        if (name.hasOwnProperty(i)) {
          this.add(i, name[i]);
        }
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
      // MediaQueryList
      media.m = matchMedia(mediaQueryString);
      // Event listener
      media.l = function() {
        var matches = media.m.matches;
        // Trigger name and name:match|unmatch
        this.trigger(name + ' ' + name + (matches ? ':match' : ':unmatch'),
          {matches: matches, media: media.s});
      }.bind(this);
      media.m.addListener(media.l);
    }

    // Use this as the fallback media query if one hasn't been set
    if (!this.fallback) {
      this.fallback = name;
    }

    return this;
  },

  // Remove media query
  remove: function(name) {
    var media = this._media[name];
    if (media) {
      if (supports) {
        // Remove event listener
        media.m.removeListener(media.l);
      }
      // Remove from registered media queries
      this._media[name] = undefined;
    }
    return this;
  },

  // Return whether the selected media query currently matches
  matches: function(name, callback) {
    var media = this._media[name];
    var matches = (media || undefined) && (supports ? media.m.matches : name === this.fallback);
    if (typeof callback === 'function') {
      if (matches) {
        callback({matches: matches, media: media.s});
      }
      return this;
    }
    return matches;
  }
});

module.exports = MQ;
