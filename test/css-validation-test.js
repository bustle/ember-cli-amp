var chai = require('chai');
var expect = chai.expect;
var AddonTestApp = require('ember-cli-addon-tests').AddonTestApp;
chai.use(require('chai-fs'));
var expectArrayIncludesMatching = require('./utils/expect-array');

var timeout = 300000;

describe('css validation', function() {
  this.timeout(timeout);

  var app;

  before(function() {
    app = new AddonTestApp();
  });

  it('displays validation error message', function() {
    return app.create('css-invalid').then(function() {
      return app.runEmberCommand('build');
    }).then(function(results) {
      expect(results).to.contain.all.keys('output', 'errors');
      expectArrayIncludesMatching(results.errors, /AMP CSS failed validation/);
    });
  });

  it('displays validation success message', function() {
    return app.create('css-valid').then(function() {
      return app.runEmberCommand('build');
    }).then(function(results) {
      expect(results).to.contain.all.keys('output', 'errors');
      expectArrayIncludesMatching(results.output, /AMP CSS validated/);
    });
  });
});
