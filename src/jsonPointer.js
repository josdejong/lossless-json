// JavaScript Object Notation (JSON) Pointer
// https://tools.ietf.org/html/rfc6901

/**
 * Escape a JSON Pointer
 *
 * @param {string} str
 * @returns {string}
 */
export function escape (str) {
  return str
      .replace(/\//g, '~1')
      .replace(/~/g, '~0')
}

/**
 * Unescape a JSON Pointer
 *
 * @param {string} str
 * @returns {string}
 */
export function unescape (str) {
  return str
      .replace(/~1/g, '/')
      .replace(/~0/g, '~')
}

/**
 * Stringify an array of keys as a JSON Pointer URI fragment
 *
 * Example:
 *
 *     stringify(['foo', 'bar'])     // returns '#/foo/bar'
 *     stringify(['foo bar', 'baz']) // returns '#/foo%20bar/baz'
 *
 * @param {Array.<string>} array
 * @returns {string}
 */
export function stringifyJSONPointer(array) {
  return '#/' + array.map(escape).join('/');
}

/**
 * Parse a JSON Pointer URI fragment
 * @param {string} pointer
 * @return {Array.<string>}
 */
export function parseJSONPointer(pointer) {
  let array = pointer.split('/').map(unescape);

  // remove the hash
  let hash = array.shift();
  if (hash !== '#') {
    throw SyntaxError('Cannot parse JSON Pointer: no valid URI fragment');
  }

  // remove last empty entry
  if (array[array.length - 1] === '') {
    array.pop();
  }

  return array;
}
