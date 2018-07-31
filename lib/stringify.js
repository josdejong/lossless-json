'use strict';

import { config } from './config'
import { stringify as stringifyPointer } from './pointer';

// Keep track of the stack to handle circular references
// https://github.com/manuelstofer/json-pointer/blob/master/index.js
// stack of currently stringified objects
let path = [];  // keys on the current stack
let stack = []; // objects (Object or Array) on the current stack

/**
 * The LosslessJSON.stringify() method converts a JavaScript value to a JSON string,
 * optionally replacing values if a replacer function is specified, or
 * optionally including only the specified properties if a replacer array is specified.
 *
 * @param {*} value
 * The value to convert to a JSON string.
 *
 * @param {function(key: string, value: *) | Array.<string | number>} [replacer]
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
  // clear stack
  stack = [];
  path = [];

  let _value = (typeof replacer === 'function')
      ? replacer.call({'': value}, '', value)
      : value;

  let _space; // undefined by default
  if (typeof space === 'number') {
    if (space > 10) {
      _space = repeat(' ', 10);
    }
    else if (space >= 1) {
      _space = repeat(' ', space);
    }
    // else ignore
  }
  else if (typeof space === 'string' && space !== '') {
    _space = space;
  }

  return stringifyValue(_value, replacer, _space, '');
}

/**
 * Stringify a value
 * @param {*} value
 * @param {function | Array.<string | number>} [replacer]
 * @param {string} [space]
 * @param {string} [indent]
 * @return {string | undefined}
 */
function stringifyValue(value, replacer, space, indent) {
  // boolean, null, number, string, or date
  if (typeof value === 'boolean' || value instanceof Boolean ||
      value === null ||
      typeof value === 'number' || value instanceof Number ||
      typeof value === 'string' || value instanceof String ||
      value instanceof Date) {
    return JSON.stringify(value);
  }

  // lossless number, the secret ingredient :)
  if (value && value.isLosslessNumber) {
    return value.value;
  }

  // array
  if (Array.isArray(value)) {
    return stringifyArray(value, replacer, space, indent);
  }

  // object (test lastly!)
  if (value && typeof value === 'object') {
    return stringifyObject(value, replacer, space, indent);
  }

  return undefined;
}

/**
 * Stringify an array
 * @param {Array} array
 * @param {function | Array.<string | number>} [replacer]
 * @param {string} [space]
 * @param {string} [indent]
 * @return {string}
 */
function stringifyArray(array, replacer, space, indent) {
  let childIndent = space ? (indent + space) : undefined;
  let str = space ? '[\n' : '[';

  // check for circular reference
  if (isCircular(array)) {
    return stringifyCircular(array, replacer, space, indent);
  }

  // add this array to the stack
  const stackIndex = stack.length;
  stack[stackIndex] = array;

  for (let i = 0; i < array.length; i++) {
    let key = i + '';
    let item = (typeof replacer === 'function')
        ? replacer.call(array, key, array[i])
        : array[i];

    if (space) {
      str += childIndent;
    }

    if (typeof item !== 'undefined' && typeof item !== 'function') {
      path[stackIndex] = key;
      str += stringifyValue(item, replacer, space, childIndent);
    }
    else {
      str += 'null'
    }

    if (i < array.length - 1) {
      str += space ? ',\n' : ',';
    }
  }

  // remove current entry from the stack
  stack.length = stackIndex;
  path.length = stackIndex;

  str += space ? ('\n' + indent + ']') : ']';
  return str;
}

/**
 * Stringify an object
 * @param {Object} object
 * @param {function | Array.<string | number>} [replacer]
 * @param {string} [space]
 * @param {string} [indent]
 * @return {string}
 */
function stringifyObject(object, replacer, space, indent) {
  let childIndent = space ? (indent + space) : undefined;
  let first = true;
  let str = space ? '{\n' : '{';

  if (typeof object.toJSON === 'function') {
    return stringify(object.toJSON(), replacer, space);
  }

  // check for circular reference
  if (isCircular(object)) {
    return stringifyCircular(object, replacer, space, indent);
  }

  // add this object to the stack
  const stackIndex = stack.length;
  stack[stackIndex] = object;

  for (let key in object) {
    if (object.hasOwnProperty(key)) {
      let value = (typeof replacer === 'function')
          ? replacer.call(object, key, object[key])
          : object[key];

      if (includeProperty(key, value, replacer)) {
        if (first) {
          first = false;
        }
        else {
          str += space ? ',\n' : ',';
        }

        str += space
            ? (childIndent + '"' + key + '": ')
            : ('"' + key + '":');

        path[stackIndex] = key;
        str += stringifyValue(value, replacer, space, childIndent);
      }
    }
  }

  // remove current entry from the stack
  stack.length = stackIndex;
  path.length = stackIndex;

  str += space ? ('\n' + indent + '}') : '}';
  return str;
}

/**
 * Test whether an object or array is a circular reference
 * @param {Object | Array} value
 * @return {boolean}
 */
function isCircular(value) {
  return stack.indexOf(value) !== -1;
}

/**
 * Stringify a circular reference
 * @param {Object | Array} value
 * @param {function | Array.<string | number>} [replacer]
 * @param {string} [space]
 * @param {string} [indent]
 * @return {string}
 */
function stringifyCircular (value, replacer, space, indent) {
  if (!config().circularRefs) {
    throw new Error('Circular reference at "' + stringifyPointer(path) + '"');
  }

  let pathIndex = stack.indexOf(value);

  let circular = {
    $ref: stringifyPointer(path.slice(0, pathIndex))
  };

  return stringifyObject(circular, replacer, space, indent);
}

/**
 * Test whether to include a property in a stringified object or not.
 * @param {string} key
 * @param {*} value
 * @param {function(key: string, value: *) | Array<string | number>} [replacer]
 * @return {boolean}
 */
function includeProperty (key, value, replacer) {
  return typeof value !== 'undefined'
      && typeof value !== 'function'
      && (!Array.isArray(replacer) || contains(replacer, key));
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
    if (array[i] === value) { // non-strict equality check!
      return true;
    }
  }
  return false;
}

/**
 * Repeat a string a number of times.
 * Simple linear solution, we only need up to 10 iterations in practice
 * @param {string} text
 * @param {number} times
 * @return {string}
 */
function repeat (text, times) {
  let res = '';
  while (times-- > 0) {
    res += text;
  }
  return res;
}
