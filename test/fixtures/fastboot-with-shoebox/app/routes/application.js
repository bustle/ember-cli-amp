import Route from 'ember-route';
import injectService from 'ember-service/inject';
import deactivateShoebox from 'ember-cli-amp/utils/deactivate-shoebox';

export default Route.extend({
  amp: injectService('amp'),
  fastboot: injectService('fastboot'),

  afterModel() {
    let amp = this.get('amp');
    amp.set('title', 'page title');
    amp.set('canonicalUrl', '/canonical-url');

    let shoebox = this.get('fastboot.shoebox');
    shoebox.put('foo', 'bar');

    deactivateShoebox(this);
  }
});
