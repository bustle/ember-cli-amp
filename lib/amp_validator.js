/* jshint node:true */
var Validator = require('amphtml-validator');

/**
 * @param {String} html
 * @return {Promise}
 */
function validate(html) {
  return Validator.getInstance().then(function(validator) {
    var results = validator.validateString(html);
    return results;
  });
}

module.exports = validate;
