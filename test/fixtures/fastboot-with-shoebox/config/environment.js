/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'fastboot-with-shoebox',
    environment: environment,
    rootURL: '/',
    locationType: 'auto',

    fastboot: {
      htmlFile: 'amp-index.html'
    }
  };

  return ENV;
};
