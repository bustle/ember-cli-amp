# ember-cli-amp

This addon simplifies the process of running your ember app in an AMP-compatible way with Fastboot.

It adds the following capabilities:

### `amp` service

The `amp` service provides the method `registerExtension` which you can use to opt-in to one of the
[AMP extensions](https://github.com/ampproject/amphtml/tree/master/extensions) that AMP provides
(e.g. amp-instagram, amp-twitter, etc). AMP requires one to include the appropriate script tag for
each extension in the document's `<head>`. Adding extensions with `registerExtension` will cause the
appropriate script tags to be added to the document when rendering.

`registerExtension` accepts the name of the extension without the "amp-" prefix, e.g.:
```javascript
this.get('amp').registerExtension('twitter'); // registers the `amp-twitter` extension
```

AMP also requires some other data to be included in a valid AMP HTML page including `title` and `canonicalURL`.
Both of these should be set on the `amp` service, typically in the `model` or `afterModel` hook in your route:
```javascript
// route.js
// ...
afterModel(post) {
  this.get('amp').set('canonicalURL', post.get('url'));
  this.get('amp').set('title', post.get('title'));
}
```

### `{{amp-sidebar}}`

This addon provides an `{{amp-sidebar}}` component that can be used to display the [`amp-sidebar`](https://github.com/ampproject/amphtml/blob/master/extensions/amp-sidebar/amp-sidebar.md).
AMP's requirements for the sidebar (that it be a direct child of `<body>`, e.g.) are difficult to naturally conform to in Ember. The `{{amp-sidebar}}` extension includes the code necessary to reposition the sidebar appropriately when the app renders.

### CSS Inclusion and Validation

AMP has several constraints surrounding CSS. Externally-linked CSS files are not allowed, so `ember-cli-amp` handles inlining the CSS into the built index.html at build time.
AMP also disallows certain types of CSS rules (e.g., `!important`). `ember-cli-amp` adds a CSS validation step to the build process. If your CSS is invalid you will see errors printed to the terminal at build time.

## Installation

* `ember install ember-cli-amp`

ember-cli-amp augments the `ember build` process to:
  * Write a valid AMP HTML file to the build output directory
  * Inject your CSS into the AMP HTML file (because AMP does not allow externally-linked CSS files)

In your `ember-cli-build.js` file add the following options:
```javascript
// ember-cli-build.js
const app = new EmberApp(defaults, {
  // ...

  // Add this section:
  amp: {
    css: 'relative/path/to/built/css/file',  // e.g.: "assets/my-amp-styles.css"
    index: 'desired_name_of_amp_index_html_file' // e.g.: "amp-index.html"
  }
});
```

`ember-cli-amp` reads your compiled CSS amp file and inlines it into the amp index html
file in your build output.

You will likely want to use the `outputPaths` option to instruct ember-cli to build
a specific CSS file for you to use for AMP. For example, if you have a file `styles/amp.scss`
that you want to become your amp CSS file, you should do:
```javascript
// ember-cli-build.js
const app = new EmberApp(defaults, {
  // ...

  outputPaths: {
    app: {
      css: {
        // Specify where 'amp.scss' should be built to. This value will be the value
        // you use for the 'css' option in the `amp` section of your options
        // (as described above)
        amp: 'assets/my-amp-styles.css'
      }
    }
  }
});
```
This configuration instructs ember-cli to build the file `styles/amp.scss` and
write it to the location `assets/my-amp-styles.css` in your output dir (e.g., `dist/`).

### Usage with Fastboot

Note: You **must** be using Fastboot@master or a version that is `> 1.0.0-beta.8` (beta 8 will *not* work).

You will need to use Fastboot to serve your Ember app in the AMP shell.
When it handles requests, Fastboot by default will attempt to insert your app's rendered
HTML into the `<head>` and `<body>` tags of your index.html file. But because the
index.html file is not a valid AMP file, this default won't work for this purpose (it would generate an invalid AMP document).

Fastboot allows you to change its default behavior and specify your own HTML file for it to
insert rendered content into. To do this, set the `fastboot.htmlFile` in your `config/environment.js`:
```javascript
// config/environment.js

// ...
fastboot: {
  htmlFile: 'amp-index.html'
}
```

Now, serve your app through Fastboot!
 * `ember fastboot`

## AMP Caveats

AMP does not allow externally-linked CSS files *or* JS files, so:
  * The AMP HTML file that ember-cli-amp generates does not have `<script>` tags. Unlike typical fastboot, your ember app won't boot up and "hydrate" the DOM when the page loads.
  * The CSS file you specify in options is injected into the AMP HTML file directly.

## FAQ

  * How do I include other custom AMP extension scripts?

Use the `registerExtension` method of the `amp` service, e.g.:
```javascript
this.get('amp').registerExtension('iframe');
```

  * How do I specify other required AMP metadata, e.g. `canonicalURL` or `title`?

Set the property on the `amp` service in your route's `model` or `afterModel` hook.
