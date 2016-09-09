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

var PLACEHOLDERS = {
  fastbootHead: '<!-- EMBER_CLI_FASTBOOT_HEAD -->',
  fastbootBody: '<!-- EMBER_CLI_FASTBOOT_BODY -->',
  ampCSS: '<!-- EMBER_CLI_AMP_CSS_PLACEHOLDER -->'
};

var timeout = 300000;

describe('serving fastboot', function() {
  this.timeout(timeout);

  var app;

  before(function() {
    app = new AddonTestApp();

    return app.create('fastboot')
      .then(function() {
        return addFastbootDeps(app);
      }).then(function() {
        return app.startServer({command: 'fastboot'});
      });
  });

  after(function() {
    return app.stopServer();
  });

  it('renders valid HTML', function() {
    return request('http://localhost:49741/')
      .then(function(response) {
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.contain('<title>page title</title>');
        expect(response.body).to.contain('<link rel="canonical" href="/canonical-url">');
        expect(response.body).to.contain('<style amp-custom>body { color: blue; }\n</style>');

        Object.keys(PLACEHOLDERS).forEach(function(key) {
          expect(response.body).to.not.contain(PLACEHOLDERS[key], 'does not contain ' + key);
        });

        return validateAMP(response.body);
      }).then(function(result) {
        expect(result.errors).to.be.empty;
      });
  });
});
