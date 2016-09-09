var chai = require('chai');
var expect = chai.expect;
var AddonTestApp = require('ember-cli-addon-tests').AddonTestApp;
chai.use(require('chai-fs'));
var assert = require('assert');
var expectArrayIncludesMatching = require('./utils/expect-array');
var RSVP = require('rsvp');
var request = RSVP.denodeify(require('request'));
var addFastbootDeps = require('./utils/add-fastboot-deps');

var validateAMP = require('../lib/amp_validator');

var timeout = 300000;

describe('serving fastboot and calling amp.addExtension', function() {
  this.timeout(timeout);

  var app;

  before(function() {
    app = new AddonTestApp();

    return app.create('fastboot-add-extension')
      .then(function() {
        return addFastbootDeps(app);
      }).then(function() {
        return app.startServer({command: 'fastboot'});
      });
  });

  after(function() {
    return app.stopServer();
  });

  it('adds extension script to head', function() {
    return request('http://localhost:49741/')
      .then(function(response) {
        var src = "https://cdn.ampproject.org/v0/amp-soundcloud-0.1.js";
        expect(response.body).to.contain(`<script async custom-element="amp-soundcloud" src="${src}"></script>`);
      });
  });
});
