var assert = require('assert');

module.exports = function expectArrayIncludesMatching(array, regex) {
  for (var i = 0; i < array.length; i++) {
    if (regex.test(array[i])) {
      assert.ok(true, 'Array contains item matching: ' + regex);
      return;
    }
  }

  assert.ok(false, 'Array ' + array + 'did not contain item matching: ' + regex);
};
