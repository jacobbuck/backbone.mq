# backbone.mq

Backbone plugin to detect and listen to media queries.

## Usage

### Setup

Create a new MQ object to get started.

```js
import MQ from 'backbone.mq'

const mq = new MQ()
```

Then add your media queries you would like to use.

```js
mq.add('desktop', 'only screen and (min-width:60em)')
```

Or add multiple media queries.

```js
mq.add({
	'desktop': 'screen and (min-width:60em)',
	'mobile': 'handheld or screen and (max-width:59.99em)'
})
```

Or add your media queries when you initialize your MQ object.

```js
const mq = new MQ({
	'desktop': 'screen and (min-width:60em)',
	'mobile': 'handheld or screen and (max-width:59.99em)'
})
```

You can also remove media queries.

```js
mq.remove('mobile')
```

### Detection

At any point you can see if your media query matches.

```js
const isDesktop = mq.matches('desktop') // -> boolean

if (isDesktop) {
	// Do some desktopy things
}
```

Alternatively this works too.

```js
mq.matches('desktop', function() {
	// Also do some desktopy things
})
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
})

mq.once('mobile:match', function() {
	// I'm on a phone!
})

backboneThing.listenTo(mq, 'desktop:unmatch', function() {
	// Wait, we're not on a desktop any more? How did that happen?
})

mq.off('desktop')
```

### Chainable

Most methods on MQ are chainable.

```js
mq
.add({
	'desktop': 'screen and (min-width:60em)',
	'mobile': 'handheld or screen and (max-width:59.99em)'
})
.matches('desktop', function() { /* ... */ })
.once('mobile', function() { /* ... */ })
.remove('desktop')
```

Except `mq.matches()` with a single parameter, which returns a boolean :wink:

### Fallback

When `matchMedia` or media queries isn't supported, MQ will fall back to a single media query. By default the first added media query will be used, but you're welcome to override it:

```js
mq.fallback = 'mobile'; // Mobile first yo!
```

## Compatibility

Backbone.MQ requires `matchMedia` to work properly, so you might need a [polyfill](https://github.com/paulirish/matchMedia.js/) for older browsers.

## License

MIT - see [license](license)
