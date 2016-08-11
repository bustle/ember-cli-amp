# ember-cli-amp

This addon simplifies the process of running your ember app in an AMP-compatible way with Fastboot.

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

  amp: {
    css: 'relative/path/to/css/file',  // e.g.: "assets/my-amp-styles.css"
    index: 'desired_name_of_amp_index_html_file' // e.g.: "amp-index.html"
  }
});
```

ember-cli-amp uses the `postBuild` addon hook to look in the results directory
and read your (compiled) CSS file, and then write an amp-specific HTML file to
that directory with your CSS inserted in it.

You will likely want to use the `outputPaths` option to instruct ember-cli to build
a specific CSS file for you to use for AMP. For example, if you have a file `styles/amp.scss`
that you want to become your amp CSS file, you should do:
```javascript
// ember-cli-build.js
const app = new EmberApp(defaults, {
  // ...

  outputPaths: {
    // ...
    app: {
      css: {
        amp: 'assets/my-amp-styles.css'
      }
    }
  }
});
```
This configuration instructs ember-cli to build the file `styles/amp.scss` and
write it to the location `assets/my-amp-styles.css` in your output dir (e.g., `dist/`).

### Usage with Fastboot

Note: You must be using Fastboot@master or a version that is `> 1.0.0-beta.8` (beta 8 will *not* work).

You will need to use Fastboot to serve your Ember app in the AMP shell.
When it handles requests, Fastboot by default will attempt to insert your app's rendered
HTML into the `<head>` and `<body>` tags of your index.html file. But because the
index.html file is not a valid AMP file, this default won't work for this purpose.

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
  * How do I specify other required AMP metadata, e.g. `canonicalURL`?
