/* jshint node:true */
'use strict';

var fs = require('fs');
var CSS_PREFIX = '<style amp-custom>';
var CSS_SUFFIX = '</style>';

function CSSInjector(options) {
  this.template    = options.template;
  this.css         = options.css;
  this.placeholder = options.placeholder;
}

CSSInjector.prototype = {
  write: function(outputPath) {
    var css = this.wrapCSS(this.css);
    var output = this.template.replace(this.placeholder, css);

    fs.writeFileSync(outputPath, output);
  },

  wrapCSS: function(css) {
    return CSS_PREFIX + css + CSS_SUFFIX;
  }
};

module.exports = CSSInjector;
