var FASTBOOT_DEPS = {
  'ember-cli-fastboot': '~1.0.0-beta.9',
  'ember-cli-head': '^0.1.0'
};

function addFastbootDeps(app) {
  app.editPackageJSON(function(pkg) {
    Object.keys(FASTBOOT_DEPS).forEach(function(key) {
      pkg['devDependencies'][key] = FASTBOOT_DEPS[key];
    });

  });
  return app.run('npm', 'install');
}

module.exports = addFastbootDeps;
