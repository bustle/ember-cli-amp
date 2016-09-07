import getOwner from 'ember-owner/get';

// Replaces the Fastboot service shoebox,
// see: https://github.com/ember-fastboot/ember-cli-fastboot/blob/32d40b29ea2e66a5a1c997be8f511caf757c9cbb/app/services/fastboot.js#L29-L61
const InertShoebox = {
  put() {},
  retrieve() {}
};

export default function deactivateShoebox(context) {
  const fastbootInfo = getOwner(context).lookup('info:-fastboot');
  if (fastbootInfo) {
    // empty the shoebox
    fastbootInfo.shoebox = {};
  }
  // block further abiilty to put stuff into shoebox by replacing fastboot.shoebox
  context.set('fastboot.shoebox', InertShoebox);
}
