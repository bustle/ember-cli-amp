/*jshint node:true*/
'use strict';

const fs = require('fs');
const path = require('path');
const CSSValidator = require('./lib/css_validator');
const RSVP = require('rsvp');
const Promise = RSVP.Promise;

const TEMPLATE_PATH = path.resolve(__dirname, './ext/amp-index-template.html');
const CSS_PLACEHOLDER = '<!-- EMBER_CLI_AMP_CSS_PLACEHOLDER -->';
const CSS_PREFIX = '<style amp-custom>';
const CSS_SUFFIX = '</style>';

module.exports = {
  name: 'ember-cli-amp',
  description: 'Render AMP with ember-cli and fastboot',

  isDevelopingAddon() {
    return true;
  },

  /**
   * addon hook
   * @see https://ember-cli.com/api/classes/Addon.html#method_included
   */
  included(app) {
    this.options = this._initializeOptions(app.options);
  },

  /**
   * addon hook
   * Runs after ember-cli builds the app, and before syncing the built output
   * to the outputPath
   * @see https://ember-cli.com/api/classes/Addon.html#method_postBuild
   */
  postBuild(results) {
    this.options.resultsDir = results.directory;

    var css = this._readBuiltFile(this.options.paths.css);

    return this._validateCSS(css).then(() => {
      var html       = this._getHTML(css);
      var outputPath = this._pathFor(this.options.paths.index);
      fs.writeFileSync(outputPath, html);
    });
  },

  /**
   * @return {Object}
   */
  _initializeOptions(appOptions) {
    var options = {};
    var amp = appOptions.amp || {};

    options.paths = {
      css:   amp.css,
      index: amp.index
    };

    options.skipCSSValidation = !!amp.skipCSSValidation;

    if (!options.paths.css) {
      throw new Error('ember-cli-amp requires the amp.css option in ember-cli-build.js');
    }
    if (!options.paths.index) {
      throw new Error('ember-cli-amp requires the amp.index option in ember-cli-build.js');
    }

    return options;
  },

  _getHTML(options) {
    var css       = options.css;
    var template  = this._readFile(TEMPLATE_PATH);

    css = [CSS_PREFIX, css, CSS_SUFFIX].join('\n');
    return template.replace(CSS_PLACEHOLDER, css);
  },

  // read a file at an absolute path
  _readFile(absolutePath) {
    return fs.readFileSync(absolutePath, 'utf8');
  },

  // Read a file from a path relative to the results directory
  _readBuiltFile(relativePath) {
    return this._readFile(this._pathFor(relativePath));
  },

  // return the absolute path of a relative path in the results directory
  _pathFor(relativePath) {
    return path.join(this.options.resultsDir, relativePath);
  },

  _validateCSS(css) {
    if (this.options.skipCSSValidation) {
      return Promise.resolve();
    }

    var validator = new CSSValidator();
    return validator.validate(css).then(results => {
      var ui = this.ui;

      if (results.errors.length) {
        ui.writeError('AMP CSS failed validation: ');

        results.errors.forEach(function(error) {
          var code = error.code,
              severity = error.severity,
              detail = error.detail,
              extraDetail = error.extraDetail,
              specUrl = error.specUrl;

          var msg = [];
          if (detail) {
            msg.push('Details: ' + detail);
            if (extraDetail) {
              msg.push('Other Details: ' + extraDetail);
            }
          } else if (extraDetail) {
              msg.push('Details: ' + extraDetail);
          }

          msg.push('Spec URL: ' + specUrl);
          msg.push('Code: ' + code);
          msg.push('Severity: ' + severity);

          ui.writeError('  ' + msg.join('. '));
        });
      } else {
        ui.writeInfoLine('AMP CSS validated');
      }
    });
  }
};
