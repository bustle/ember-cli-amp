/*jshint node:true*/
'use strict';

var fs = require('fs');
var path = require('path');
var CSSInjector = require('./lib/css_injector');
var CSSValidator = require('./lib/css_validator');
var VersionChecker = require('ember-cli-version-checker');

var TEMPLATE_PATH = path.join(__dirname, './ext/amp-index-template.html');
var PLACEHOLDER = '<!-- EMBER_CLI_AMP_CSS_PLACEHOLDER -->';

var MINIMUM_FASTBOOT_VERSION = '1.0.0-beta.8';
var MINIMUM_EMBER_HEAD_VERSION = '0.1.0';

module.exports = {
  name: 'ember-cli-amp',
  after: 'ember-cli-fastboot',

  init() {
    this._super.apply(this, arguments);

    this._checkDeps();
  },

  /**
   * addon hook
   * Runs when the addon is initially included by ember-cli
   * @see https://ember-cli.com/api/classes/Addon.html#method_included
   */
  included(app) {
    var options       = app.options.amp || {};
    this.cssPath      = options.css;
    this.ampIndexPath = options.index;
    this.buildCount   = 0;
    this.alwaysRebuildIndex = options.alwaysRebuildIndex === undefined ? false : options.alwaysRebuildIndex;

    if (!this.cssPath) {
      throw new Error('You must specify amp.css option in ember-cli-build.js');
    }
    if (!this.ampIndexPath) {
      throw new Error('You must specify amp.index option in ember-cli-build.js');
    }
  },

  /**
   * addon hook
   * Runs after ember-cli builds the app, but before syncing the built output
   * to the outputPath. Changes made to the results directory will be synced to
   * the built output.
   * @see https://ember-cli.com/api/classes/Addon.html#method_postBuild
   */
  postBuild(results) {
    if (this._shouldRebuildIndex()) {
      return this._rebuildIndex(results).catch(err => {
        this.ui.writeError('[amp-addon] Error building amp index: ' + err);
      });
    }
  },

  /**
   * inject the CSS into the amp index template and write the index to the
   * results directory
   */
  _injectCSS(css) {
    var template  = this._readFile(TEMPLATE_PATH);
    var outputPath = this._pathFor(this.ampIndexPath);

    var cssInjector = new CSSInjector({
      css:         css,
      template:    template,
      placeholder: PLACEHOLDER
    });

    cssInjector.write(outputPath);
  },

  _readFile(absolutePath) {
    return fs.readFileSync(absolutePath, 'utf8');
  },

  _readBuiltFile(relativePath) {
    return this._readFile(this._pathFor(relativePath));
  },

  _pathFor(relativePath) {
    return path.join(this.resultsDir, relativePath);
  },

  _shouldRebuildIndex() {
    if (this.alwaysRebuildIndex) {
      return true;
    } else {
      return this.buildCount === 0;
    }
  },

  _rebuildIndex(results) {
    this.buildCount++;

    this.resultsDir = results.directory;
    var css = this._readBuiltFile(this.cssPath);

    return this._validateCSS(css)
      .then(() => this._injectCSS(css));
      .catch((err) => console.error(err));
  },

  _validateCSS(css) {
    var validator = new CSSValidator();
    return validator.validate(css)
      .then(results => this._logCSSResults(results));
  },

  _logCSSResults(results) {
    var ui = this.ui;

    if (results.errors.length) {
      ui.writeError('AMP CSS failed validation: ');

      results.errors.forEach(error => {
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
  },

  _checkDeps() {
    var checker = new VersionChecker(this);

    var fastboot = checker.for('ember-cli-fastboot', 'npm');
    var head = checker.for('ember-cli-head', 'npm');

    if (!fastboot.satisfies('> ' + MINIMUM_FASTBOOT_VERSION)) {
      this.ui.writeWarnLine('[ember-cli-amp]: ember-cli-fastboot should be > ' + MINIMUM_FASTBOOT_VERSION + '. Your version ('+fastboot.version+') may not work properly.');
    }

    if (!head.satisfies('>= ' + MINIMUM_EMBER_HEAD_VERSION)) {
      this.ui.writeWarnLine('[ember-cli-amp]: ember-cli-head should be >= ' + MINIMUM_EMBER_HEAD_VERSION + '. Your version: ' + head.version);
    }
  }
};
