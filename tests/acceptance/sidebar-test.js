import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import jQuery from 'jquery';

moduleForAcceptance('Acceptance | sidebar');

test('visiting /sidebar', function(assert) {
  visit('/sidebar');

  andThen(function() {
    assert.ok(find('#before-sidebar').length, 'has before-sidebar');
    assert.ok(find('#after-sidebar').length, 'has after-sidebar');
    assert.ok(!find('#within-sidebar').length, 'within-sidebar moved from app body');

    let sidebar = jQuery('amp-sidebar')[0];
    assert.ok(!!sidebar, 'has amp-sidebar');
    assert.ok(sidebar.parentNode === document.body, 'amp-sidebar direct parent is body');

    assert.ok(jQuery('script[src="amp-sidebar-0.1.js"]').length, 'adds amp-sidebar script');
  });
});
