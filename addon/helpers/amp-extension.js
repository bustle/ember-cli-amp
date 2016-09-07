import Helper from 'ember-helper';
import { htmlSafe } from 'ember-string';

const PREFIX = "https://cdn.ampproject.org/v0/amp-";
const SUFFIX = "-0.1.js";

/**
 * Add an AMP extension script
 * See https://www.ampproject.org/docs/reference/extended.html
 */
export function ampExtension([name] /*, hash*/) {
  let src = PREFIX + name + SUFFIX;
  let script = `<script async custom-element="amp-${name}" src="${src}"></script>`;
  return htmlSafe(script);
}

export default Helper.helper(ampExtension);
