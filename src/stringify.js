'use strict';

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
 * @param {Array<{test: (value: any) => boolean, stringify: (value: any) => string}>} [valueStringifiers]
 * An optional list with additional value stringifiers, for example to serialize
 * a BigNumber. The output of the function must be valid stringified JSON.
 * When undefined is returned, the property will be deleted from the object.
 * The difference with using a replacer is that the output of a replacer must
 * be JSON and will be stringified afterwards, whereas the output of
 * the valueStringifiers is inserted in the JSON as is.
 *
 * @returns {string | undefined} Returns the string representation of the JSON object.
 */
export function stringify(value, replacer, space, valueStringifiers) {
  const resolvedSpace = resolveSpace(space)

  const replacedValue = (typeof replacer === 'function')
    ? replacer.call({'': value}, '', value)
    : value;

  return _stringifyValue(replacedValue, '');

  /**
   * Stringify a value
   * @param {*} value
   * @param {string} [indent]
   * @return {string | undefined}
   */
  function _stringifyValue(value, indent) {
    if (Array.isArray(valueStringifiers)) {
      const stringifier = valueStringifiers.find(item => item.test(value))
      if (stringifier) {
        return stringifier.stringify(value)
      }
    }

    // boolean, null, number, string, or date
    if (typeof value === 'boolean' ||
      typeof value === 'number' ||
      typeof value === 'string' ||
      value === null ||
      value instanceof Date ||
      value instanceof Boolean ||
      value instanceof Number ||
      value instanceof String
    ) {
      return JSON.stringify(value);
    }

    // lossless number, the secret ingredient :)
    if (value && value.isLosslessNumber) {
      return value.toString();
    }

    // BigInt
    if (typeof value === 'bigint') {
      return value.toString();
    }

    // Array
    if (Array.isArray(value)) {
      return stringifyArray(value, indent);
    }

    // Object (test lastly!)
    if (value && typeof value === 'object') {
      return stringifyObject(value, indent);
    }

    return undefined;
  }

  /**
   * Stringify an array
   * @param {Array} array
   * @param {string} [indent]
   * @return {string}
   */
  function stringifyArray(array, indent) {
    let childIndent = resolvedSpace ? (indent + resolvedSpace) : undefined;
    let str = resolvedSpace ? '[\n' : '[';

    for (let i = 0; i < array.length; i++) {
      const item = (typeof replacer === 'function')
        ? replacer.call(array, String(i), array[i])
        : array[i];

      if (resolvedSpace) {
        str += childIndent;
      }

      if (typeof item !== 'undefined' && typeof item !== 'function') {
        str += _stringifyValue(item, childIndent);
      }
      else {
        str += 'null'
      }

      if (i < array.length - 1) {
        str += resolvedSpace ? ',\n' : ',';
      }
    }

    str += resolvedSpace ? ('\n' + indent + ']') : ']';
    return str;
  }

  /**
   * Stringify an object
   * @param {Object} object
   * @param {string} [indent]
   * @return {string}
   */
  function stringifyObject(object, indent) {
    const childIndent = resolvedSpace ? (indent + resolvedSpace) : undefined;
    let first = true;
    let str = resolvedSpace ? '{\n' : '{';

    if (typeof object.toJSON === 'function') {
      return stringify(object.toJSON(), replacer, space);
    }

    const keys = Array.isArray(replacer) ? replacer : Object.keys(object)

    keys.forEach(key => {
      const value = (typeof replacer === 'function')
        ? replacer.call(object, key, object[key])
        : object[key];

      if (includeProperty(key, value)) {
        if (first) {
          first = false;
        }
        else {
          str += resolvedSpace ? ',\n' : ',';
        }

        const keyStr = JSON.stringify(String(key));

        str += resolvedSpace
          ? (childIndent + keyStr + ': ')
          : keyStr + ':';

        str += _stringifyValue(value, childIndent);
      }
    })

    str += resolvedSpace ? ('\n' + indent + '}') : '}';
    return str;
  }

  /**
   * Test whether to include a property in a stringified object or not.
   * @param {string} key
   * @param {*} value
   * @return {boolean}
   */
  function includeProperty (key, value) {
    return typeof value !== 'undefined'
      && typeof value !== 'function'
      && typeof value !== 'symbol'
  }
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

/**
 * Resolve a JSON stringify
 * @param {number | string | undefined} space
 * @returns {string | undefined}
 */
function resolveSpace(space) {
  if (typeof space === 'number') {
    return repeat(' ', space);
  }

  if (typeof space === 'string' && space !== '') {
    return space
  }

  return undefined
}
