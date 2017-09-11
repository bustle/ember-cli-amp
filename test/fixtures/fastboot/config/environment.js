/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'fastboot',
    environment: environment,
    rootURL: '/',
    locationType: 'auto',

    fastboot: {
      htmlFile: 'amp-index.html'
    }
  };

  return ENV;
};
