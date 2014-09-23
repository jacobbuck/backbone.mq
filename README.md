Backbone.MQ
===========

Backbone extension to detect and listen to media queries.

Documentation
-------------

Who needs boring ol' API documentation when you get examples :stuck_out_tongue_closed_eyes:

### Setup

Create a new MQ object to get started.

```js
var mq = new Backbone.MQ();
```

Then add your media queries you would like to use.

```js
mq.add('desktop', 'only screen and (min-width:60em)');
```

Or add multiple media queries.

```js
mq.add({
	'desktop': 'screen and (min-width:60em)',
	'mobile': 'handheld or screen and (max-width:59.99em)'
});
```

Or add your media queries when you initialise your MQ object.

```js
var mq = new Backbone.MQ({
	'desktop': 'screen and (min-width:60em)',
	'mobile': 'handheld or screen and (max-width:59.99em)'
});
```

You can also remove media queries.

```js
mq.remove('mobile');
```

### Detection

At any point you can see if your media query matches.

```js
var isDesktop = mq.matches('desktop'); // -> boolean

if (isDesktop) {
	// Do some desktopy things
}
```

Alternativly this works too.

```js
mq.matches('desktop', function () {
	// Also do some desktopy things
});
```

### Events

You can also listen for when a media query becomes matched or unmatched. The MQ object extends [Backbone.Events](http://backbonejs.org/#Events), so enjoy making the most of it.

Events which are namespaced by `:match` or `:unmatch` are only triggered if the media query is matched or unmatched respectively.

```js
mq.on('desktop', function (media) {
	if (media.matches) {
		// Do some desktopy things
	} else {
		// Or not
	}
});

mq.once('mobile:match', function () {
	// I'm on a phone, I'm on a phone; Everybody look at me, 'cause I'm browsing on a phone
});

backboneThing.listenTo(mq, 'desktop:unmatch', function () {
	// Wait, we're not on a desktop any more? How did that happen?
})

mq.off('desktop');
```

### Chainable

Most methods on MQ are chainable.

```js
mq
.add({
	'desktop': 'screen and (min-width:60em)',
	'mobile': 'handheld or screen and (max-width:59.99em)'
})
.matches('desktop', function () { /* ... */ })
.once('mobile', function () { /* ... */ })
.remove('desktop');
```

Except `mq.matches()` with a single parameter, which returns a boolean :wink:

Compatibility
-------------

If Backbone and Underscore works in your browser, then this should work too. Backbone.MQ does require `window.matchMedia` to work, so you might need a [polyfill](https://github.com/paulirish/matchMedia.js/) for older browsers.

AMD and CommonJS
----------------

Yes

License
-------

MIT - see [LICENSE.md](LICENSE.md)
