/* jshint node:true */
'use strict';
const fs = require('fs');
const path = require('path');
const Validator = require('amphtml-validator');

const CSS_PLACEHOLDER     = '<!-- CUSTOM_CSS -->';
const AMP_HTML_SHELL_PATH = path.resolve(__dirname, '../ext/amp-css-validator-shell.html');

function CSSValidator() {}

CSSValidator.prototype = {
  /**
   * @return {Promise}
   */
  validate(css) {
    this.template = fs.readFileSync(AMP_HTML_SHELL_PATH, 'utf8');
    var html      = this.template.replace(CSS_PLACEHOLDER, css);

    return Validator.getInstance().then(validator => {
      var result    = validator.validateString(html);
      result.errors = result.errors.map(_convertAMPCSSError);

      return result;
    });
  }
};

function _convertAMPCSSError(error) {
  var code = error.code;
  var severity = error.severity; // can be: "ERROR"
  var detail = error.detail;
  var extraDetail = error.params && error.params[1];
  var specUrl = error.specUrl;

  return {
    code: code,
    severity: severity,
    detail: detail,
    extraDetail: extraDetail,
    specUrl: specUrl
  };
}

module.exports = CSSValidator;
