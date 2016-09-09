import Service from 'ember-service';
import computed from 'ember-computed';
import injectService from 'ember-service/inject';
import { A } from 'ember-array/utils';

let defaultExtensions = [
  'youtube',
  'twitter',
  'instagram',
  'iframe'
];

export default Service.extend({
  headData: injectService(),

  init() {
    this._super(...arguments);

    this.set('ampExtensions', defaultExtensions);
    this.set('isAmp', false);
  },

  /**
   * Register a new amp extension (this will make the script tag for that
   * extension appear in `<head>`)
   * @see https://github.com/ampproject/amphtml/tree/master/extensions
   * @param {String} extension
   */
  registerExtension(extension) {
    let extensions = A(this.get('ampExtensions')); // jshint ignore:line
    if (extensions.indexOf(extension) === -1) {
      extensions.pushObject(extension);
    }
  },

  // These properties will be proxied through to the `headData`
  // service.
  isAmp:         computed.alias('headData.isAmp'),
  ampExtensions: computed.alias('headData.ampExtensions'),
  title:         computed.alias('headData.title'),
  canonicalUrl:  computed.alias('headData.canonicalUrl'),
});
