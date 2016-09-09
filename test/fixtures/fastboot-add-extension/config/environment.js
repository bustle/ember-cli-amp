/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'fastboot-add-extension',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',

    fastboot: {
      htmlFile: 'amp-index.html'
    }
  };

  return ENV;
};
