import Component from 'ember-component';
import run from 'ember-runloop';
import injectService from 'ember-service/inject';
import { assert } from 'ember-metal/utils';
import layout from '../templates/components/amp-sidebar';

export default Component.extend({
  amp: injectService(),
  layout,

  init() {
    this._super(...arguments);

    let amp = this.get('amp');
    assert('amp-sidebar component cannot render if "amp" service is not present', !!amp);
    amp.registerExtension('sidebar');

    this._dom = this.renderer._dom;
    this._markerNode = this._dom.document.createTextNode('');
    this._didInsert = false;
  },

  willRender() {
    this._super(...arguments);
    if (!this._didInsert) {
      this._didInsert = true;

      // Have to schedule into `afterRender` here rather
      // because the `didInsertElement` is not called in Fastboot
      run.schedule('afterRender', () => {
        if (this.isDestroyed) { return; }

        this._element = this._markerNode.parentNode;

        this._attachElementToBody(this._element);
      });
    }
  },

  willDestroyElement() {
    if (this._element.parentNode) {
      this._element.parentNode.removeChild(this._element);
    }
  },

  _attachElementToBody(element) {
    // remove from parentNode if it is already attached
    // FIXME this is only necessary due to a bug in simple-dom see https://github.com/ember-fastboot/simple-dom/pull/20
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
    let body = this._dom.document.body;
    body.insertBefore(element, body.firstChild);
  }
});
