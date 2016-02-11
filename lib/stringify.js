'use strict';

// map with control characters to be escaped
const CONTROL_CHARACTERS = {
  '"': '\\"',
  '\\': '\\\\',
  '\b': '\\b',
  '\f': '\\f',
  '\n': '\\n',
  '\r': '\\r',
  '\t': '\\t'
};

/**
 * The LosslessJSON.stringify() method converts a JavaScript value to a JSON string,
 * optionally replacing values if a replacer function is specified, or
 * optionally including only the specified properties if a replacer array is specified.
 *
 * @param {*} value
 * The value to convert to a JSON string.
 *
 * @param {function | Array.<string | number>} [replacer]
 * A function that alters the behavior of the stringification process,
 * or an array of String and Number objects that serve as a whitelist for
 * selecting the properties of the value object to be included in the JSON string.
 * If this value is null or not provided, all properties of the object are
 * included in the resulting JSON string.
 *
 * @param {number | string} [space]
 * A String or Number object that's used to insert white space into the output
 * JSON string for readability purposes. If this is a Number, it indicates the
 * number of space characters to use as white space; this number is capped at 10
 * if it's larger than that. Values less than 1 indicate that no space should be
 * used. If this is a String, the string (or the first 10 characters of the string,
 * if it's longer than that) is used as white space. If this parameter is not
 * provided (or is null), no white space is used.
 *
 * @returns {string | undefined} Returns the string representation of the JSON object.
 */
export function stringify(value, replacer, space) {
  let _value = (typeof replacer === 'function')
      ? replacer('', value)
      : value;

  return stringifyValue(_value, replacer, space);
}

/**
 * Stringify a value
 * @param {*} value
 * @param {function | Array.<string | number>} [replacer]
 * @param {number | string} [space]
 * @return {string | undefined}
 */
function stringifyValue(value, replacer, space) {
  // TODO: implement space
  if (space !== undefined) {
    throw new Error('Sorry, space is not yet implemented');
  }

  // boolean
  if (value === true || value === false || value instanceof Boolean) {
    return value + '';
  }

  // null
  if (value === null) {
    return 'null';
  }

  // number
  if (typeof value === 'number' || value instanceof Number) {
    if (isNaN(value) || !isFinite(value)) {
      return 'null';
    }
    return value + '';
  }

  // lossless number, the secret ingredient :)
  if (value && value.isLosslessNumber) {
    return value.value;
  }

  // string
  if (typeof value === 'string' || value instanceof String) {
    let escaped = '';

    for (let i = 0; i < value.length; i++) {
      let c = value[i];
      escaped += CONTROL_CHARACTERS[c] || c;
    }

    return '"' + escaped + '"';
  }

  // date
  if (value instanceof Date) {
    return '"' + value.toISOString() + '"';
  }

  // array
  if (Array.isArray(value)) {
    return stringifyArray(value, replacer, space);
  }

  // object (test lastly!)
  if (value && typeof value === 'object') {
    return stringifyObject(value, replacer, space);
  }

  return undefined;
}

/**
 * Stringify an array
 * @param {Array} array
 * @param {function | Array.<string | number>} [replacer]
 * @param {number | string} [space]
 * @return {string}
 */
function stringifyArray(array, replacer, space) {
  let str = '[';

  for (let i = 0; i < array.length; i++) {
    let item = (typeof replacer === 'function')
        ? replacer(i + '', array[i])
        : array[i];

    if (typeof item !== 'undefined' && typeof item !== 'function') {
      str += stringifyValue(item, replacer, space);
    }
    else {
      str += 'null'
    }

    if (i < array.length - 1) {
      str += ',';
    }
  }

  str += ']';
  return str;
}

/**
 * Stringify an object
 * @param {Object} object
 * @param {function | Array.<string | number>} [replacer]
 * @param {number | string} [space]
 * @return {string}
 */
function stringifyObject(object, replacer, space) {
  if (typeof object.toJSON === 'function') {
    return stringify(object.toJSON(), replacer, space);
  }

  let first = true;
  let str = '{';
  for (let key in object) {
    if (object.hasOwnProperty(key)) {
      let value = (typeof replacer === 'function')
          ? replacer(key, object[key])
          : object[key];

      if (typeof value !== 'undefined'
          && typeof value !== 'function'
          && (!Array.isArray(replacer) || contains(replacer, key))) {
        if (first) {
          first = false;
        }
        else {
          str += ',';
        }

        str += '"' + key + '":' + stringifyValue(value, replacer, space);
      }
    }
  }

  str += '}';
  return str;
}

/**
 * Check whether an array contains some value.
 * Uses a non-strict comparison, so contains([1,2,3], '2') returns true
 * @param {Array} array
 * @param {*} value
 * @return {boolean}
 */
function contains(array, value) {
  for (let i = 0; i < array.length; i++) {
    if (array[i] == value) { // non-strict equality check!
      return true;
    }
  }
  return false;
}
