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

describe('serving fastboot with shoebox', function() {
  this.timeout(timeout);

  var app;

  before(function() {
    app = new AddonTestApp();

    return app.create('fastboot-with-shoebox')
      .then(function() {
        return addFastbootDeps(app);
      }).then(function() {
        return app.startServer({command: 'fastboot'});
      });
  });

  after(function() {
    return app.stopServer();
  });

  it('using deactivateShoebox util suppresses rendering of shoebox', function() {
    return request('http://localhost:49741/')
      .then(function(response) {
        // General shoebox
        expect(response.body).to.not.contain('<script type="fastboot/shoebox"');

        // Specific shoebox
        expect(response.body).to.not.contain(
          '<script type="fastboot/shoebox" id="shoebox-foo">"bar"</script>'
        );
      });
  });
});
