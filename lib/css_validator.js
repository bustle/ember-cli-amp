/* jshint node:true */
'use strict';
var fs = require('fs');
var path = require('path');
var Validator = require('amphtml-validator');

var CSS_PLACEHOLDER     = '<!-- CUSTOM_CSS -->';
var AMP_CSS_HTML_TEMPLATE_PATH = path.resolve(__dirname, '../ext/amp-css-validator-template.html');

function CSSValidator() {}

CSSValidator.prototype = {
  /**
   * @return {Promise}
   */
  validate(css) {
    this.template = fs.readFileSync(AMP_CSS_HTML_TEMPLATE_PATH, 'utf8');
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
