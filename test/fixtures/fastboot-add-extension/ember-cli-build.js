/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    amp: {
      css: 'assets/fastboot-add-extension.css',
      index: 'amp-index.html'
    }
  });

  return app.toTree();
};
