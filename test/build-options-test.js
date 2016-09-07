var chai = require('chai');
var expect = chai.expect;
var AddonTestApp = require('ember-cli-addon-tests').AddonTestApp;
chai.use(require('chai-fs'));
var assert = require('assert');
var expectArrayIncludesMatching = require('./utils/expect-array');

var timeout = 300000;

describe('build options test: no amp.css', function() {
  this.timeout(timeout);

  var app;

  before(function() {
    app = new AddonTestApp();
    return app.create('build-options-no-amp-css');
  });

  it('throws error mentioning missing amp.css', function() {
    return app.runEmberCommand('build').then(function() {
      assert.ok(false, 'Should not build');
    }).catch(function(err) {
      expect(err).to.contain.all.keys('errors');
      expectArrayIncludesMatching(err.errors, /You must specify amp.css option/);
    });
  });
});

describe('build options test: no amp.index', function() {
  this.timeout(timeout);

  var app;

  before(function() {
    app = new AddonTestApp();
    return app.create('build-options-no-amp-index');
  });

  it('throws error mentioning missing amp.index', function() {
    return app.runEmberCommand('build').then(function() {
      assert.ok(false, 'Should not build');
    }).catch(function(err) {
      expect(err).to.contain.all.keys('errors');
      expectArrayIncludesMatching(err.errors, /You must specify amp.index option/);
    });
  });
});
