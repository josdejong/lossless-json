/**
 * Transform a json object.
 * Applies the callback function recursively on all values in the JSON object.
 * @param {*} json   A JSON Object, Array, or value
 * @param {function (key: string, value: *)} callback
 *              A callback function invoked with arguments `key` and `value`,
 *              which must return a replacement value. The function context
 *              (`this`) is the Object or Array that contains the currently
 *              handled value.
 * @return {*}
 */
export function transform (json, callback) {
  return transformValue({'': json}, '', json, callback);
}

/**
 * Transform a value
 * @param {Object | Array} context
 * @param {string} key
 * @param {*} value
 * @param {function(key: string, value: *)} callback
 * @return {*}
 */
function transformValue (context, key, value, callback) {
  if (Array.isArray(value)) {
    return callback.call(context, key, transformArray(value, callback));
  }
  else if (value && typeof value === 'object') {
    return callback.call(context, key, transformObject(value, callback))
  }
  else {
    return callback.call(context, key, value)
  }
}

/**
 * Transform the properties of an object
 * @param {Object} object
 * @param {function} callback
 * @return {Object}
 */
function transformObject (object, callback) {
  let transformed = {};

  for (let key in object) {
    if (object.hasOwnProperty(key)) {
      transformed[key] = transformValue(object, key, object[key], callback);
    }
  }

  return transformed;
}

/**
 * Transform the properties of an Array
 * @param {Array} array
 * @param {function} callback
 * @return {Array}
 */
function transformArray (array, callback) {
  let transformed = [];

  for (let i = 0; i < array.length; i++) {
    transformed[i] = transformValue(array, i + '', array[i], callback);
  }

  return transformed;
}
