# ember-cli-amp

This addon makes it possible to render valid Google's [Accelerated Mobile Pages project](https://www.ampproject.org/) (AMP) pages with your ember app and Fastboot.

## Usage

First, install the addon:
  * `ember install ember-cli-amp`

Then, in order for your pages to render valid AMP you must:
  * add `amp` options to `ember-cli-build.js`
  * edit `outputPaths` in `ember-cli-build.js`
  * add or update a `head.hbs` template to render the amp partial

### Add `amp` options to `ember-cli-build.js`

ember-cli-amp augments the `ember build` process to write a valid AMP HTML file in your build output directory, with
your AMP css inlined into it (due to AMP's restriction on externally-linked stylesheets).
To make this happen you need to specify options to tell it what CSS file to read your AMP CSS from and what filename to use for the built AMP HTML file.

In your `ember-cli-build.js` file add the following options:
```javascript
// ember-cli-build.js
const app = new EmberApp(defaults, {
  // ...

  // Add this section:
  amp: {
    css: 'relative/path/to/built/css/file',  // e.g.: "assets/my-amp-styles.css"

    // The index file will include the inlined the contents of the above CSS file
    // and appear with the given name in your output dir (e.g. `dist/`) alongside
    // your index.html file
    index: 'desired_name_of_amp_index_html_file' // e.g.: "amp-index.html"
  }
});
```

### Edit `outputPaths` in `ember-cli-build.js`

`ember-cli-amp` reads your *compiled* CSS amp file and inlines it into the amp index html
file in your build output.

You will likely want to use the `outputPaths` option to instruct ember-cli to build
a specific CSS file for you to use for AMP. For example, if you have the file `styles/amp.scss`
that you want to become your AMP CSS file, you should do:
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

### Configure Fastboot to use custom HTML file

In order to create valid AMP pages, you *must* serve your AMP routes with Fastboot.

AMP pages require a certain HTML boilerplate that differs from the index.html file that an ember app typically uses
(and that Fastboot typically renders its content into).
You need to add a setting for Fastboot to instruct it to use your AMP index.html file instead of the standard index.html file.

Fastboot allows you to change your own HTML file for it to insert rendered content into by setting the
`fastboot.htmlFile` in your `config/environment.js`:
```javascript
// config/environment.js

// ...
fastboot: {
  // This value must be the same as the one you use for the `amp.index`
  // configuration option in your ember-cli-build.js file
  htmlFile: 'amp-index.html'
}
```

### Render `head` template

`ember-cli-amp` uses [`ember-cli-head`](https://github.com/ronco/ember-cli-head) to render content in the `<head>` tag (such as title, canonicalUrl, etc).
In order for this to work properly, you must add the `head.hbs` template to your app and render the `amp/-head` partial:

  * Create the file `app/templates/head.hbs` (if you have a `head.hbs` because you are already using `ember-cli-head`, skip this step)
  * Add the line `{{partial "amp/-head"}}` to this template. ember-cli-amp will use this partial to render the necessary `<head>` content for AMP pages

Now, serve your app through Fastboot!
 * `ember fastboot`

## Capabilities

`ember-cli-amp` exposes the following primitives for use in your app:

### `amp` service

A valid AMP page requires a title and a canonical URL in the `<head>`. Inject the `amp` service
and set the following properties:

  * `title` - The title of the page
  * `canonicalUrl` - ember-cli-amp will use this to render the required canonical url `<link>` in the `<head>` of your page
  * `isAmp` - If you have an ember app that will render AMP for some routes only,
              you should set and unset this property in the `activate`/`deactivate` methods of your amp route so that other parts
              of your app can act accordingly (e.g., you may want or need to render templates differently for your amp routes)

These properties should be set on the `amp` service, typically in the `model` or `afterModel` hook in your route:
```javascript
// route.js
// ...
afterModel(post) {
  this.get('amp').set('canonicalUrl', post.get('url'));
  this.get('amp').set('title', post.get('title'));
}
```

In addition, the `amp` service provides the method `registerExtension` which you can use to opt-in to one of the
[extensions](https://github.com/ampproject/amphtml/tree/master/extensions) that AMP provides
(e.g. amp-instagram, amp-twitter, etc). AMP requires one to include the appropriate script tag for
each extension in the document's `<head>`. Adding extensions with `registerExtension` will cause the
appropriate script tags to be added to the document when rendering.

`registerExtension` accepts the name of the extension without the "amp-" prefix, e.g.:
```javascript
this.get('amp').registerExtension('twitter'); // registers the `amp-twitter` extension
```

### `{{amp-sidebar}}`

The `{{amp-sidebar}}` component can be used to display AMP's [`<amp-sidebar>`](https://github.com/ampproject/amphtml/blob/master/extensions/amp-sidebar/amp-sidebar.md).
AMP requirement the sidebar to be a direct child of `<body>`, which is difficult to naturally do to in Ember.
The `{{amp-sidebar}}` extension includes the code necessary to reposition the sidebar appropriately when the app renders.

### `deactivateShoebox` utility method

AMP does not allow any `<script>` tags on the page (aside from those required in its boilerplate or for AMP extensions).
If you are using the [Fastboot shoebox](https://github.com/ember-fastboot/ember-cli-fastboot#the-shoebox) utility, Fastboot will render `<script>` tags on the page to hold your data and AMP will mark the page as invalid.
In order to fix this, you can use the `deactivateShoebox` utility method that ember-cli-amp provides:

```javascript
import deactivateShoebox from 'ember-cli-amp/utils/deactivate-shoebox';
...

afterModel() {
  deactivateShoebox(this);
}
```

`deactivateShoebox` will empty any existing contents in the shoebox and replace `fastboot.shoebox` with a stub object so that any shoebox data set elsewhere in the app will be ignored.

### CSS Inclusion and Validation

AMP has several constraints surrounding CSS. Externally-linked CSS files are not allowed, so `ember-cli-amp` handles inlining the CSS into the AMP index.html file it builds.
AMP also disallows certain types of CSS rules (e.g., `!important`). `ember-cli-amp` adds a CSS validation step to the build process. If your CSS is invalid you will see errors printed to the terminal at build time.

## AMP Caveats

AMP does not allow externally-linked CSS files *or* JS files, so:
  * The AMP HTML file that ember-cli-amp generates does not have `<script>` tags. Unlike typical fastboot, your ember app won't boot up and "hydrate" the DOM when the page loads.
  * The CSS file you specify in options is injected into the AMP HTML file directly.

Read more about AMP at th [AMP docs page](https://www.ampproject.org/docs/get_started/about-amp.html).

## FAQ

  * How do I include other custom AMP extension scripts?

Use the `registerExtension` method of the `amp` service, e.g.:
```javascript
this.get('amp').registerExtension('iframe');
```

  * How do I specify other required AMP metadata, e.g. `canonicalUrl` or `title`?

Set the property on the `amp` service in your route's `model` or `afterModel` hook.

  * Should I use a separate repo/project for my ember AMP pages?

It definitely requires some work, but it is possible to make your ember app a "hybrid" where some routes are AMP and some are not. Doing so will allow you to reuse parts of your existing codebase.
Juggling the multiple contexts in which your ember app may be run ("normal" JS ember app, Fastboot, Fastboot+AMP) requires some finesse, so it's up to you to weigh the pros and cons.
If you do mix AMP routes with non-AMP routes in your AMP, you should set/unset the `isAmp` property on the `amp` service in your `activate`/`deactivate` route methods. This will make it easier to tweak the rendering of your templates in the two contexts (typically you will need to simplify your templates to make them valid AMP, or leverage AMP extensions like `<amp-twitter>` etc. if you are rendering embedded tweets and other "rich" content).

  * How do I deploy AMP pages?

The same way you would deploy Fastboot, with an important caveat: for AMP routes, Fastboot needs to inject your rendered app into the AMP html boilerplate (the filename that you specified with the `amp.index` property in `ember-cli-build.js`, and referenced in the `fastboot.htmlFile` property of your `config/environment.js`). But for your non-AMP routes, Fastboot should inject the content into the standard `index.html` file.
How you accomplish this will depend on your setup, but you may need to ensure your deployment environment can direct requests for the AMP routes to a Fastboot instance that is configured to use the AMP boilerplate, and requests for non-AMP routes to a Fastboot that's configured using the defaults.
If you are using [`Fastboot`](https://github.com/ember-fastboot/fastboot) directly, you can pass an `html` option to instruct it on a per-request basis:

```javascript
const FastBoot = require('fastboot');

let app = new FastBoot({
  distPath: 'path/to/dist'
});

let url = '/photos/1/amp';

let options = {};
if (routeIsAMP(url)) {
  options.html = 'path/to/dist/amp-index.html' // e.g.
}

app.visit(url, options)
  .then(result => result.html())
  .then(html => res.send(html));
```
