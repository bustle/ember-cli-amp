/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    amp: {
      // Intentionally leave css out
      // css: 'assets/build-options-no-amp-css.css',
      index: 'amp-index.html'
    }
  });

  return app.toTree();
};
