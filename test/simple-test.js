var chai = require('chai');
var expect = chai.expect;
var AddonTestApp = require('ember-cli-addon-tests').AddonTestApp;
chai.use(require('chai-fs'));

var timeout = 300000;

describe('simple acceptance', function() {
  this.timeout(timeout);

  var app;

  before(function() {
    app = new AddonTestApp();
    return app.create('simple').then(function() {
      return app.runEmberCommand('build');
    });
  });

  it('builds amp-index', function() {
    expect(app.filePath('dist/amp-index.html')).to.be.a.file();
  });

  it('inlines CSS', function() {
    expect(app.filePath('dist/amp-index.html')).to.have.content.that.match(/body { color: red; }/);
  });
});
