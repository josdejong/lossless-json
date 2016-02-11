/**
 * Revive a json object. Applies the reviver function on all values in the JSON
 * object.
 * @param {*} json
 * @param {function (key: string, value: *)} reviver
 * @return {*}
 */
export function revive (json, reviver) {
  return reviveValue({'': json}, '', json, reviver);
}

/**
 * Revive a value
 * @param {Object | Array} context
 * @param {string} key
 * @param {*} value
 * @param {function(key: string, value: *)} reviver
 * @return {*}
 */
function reviveValue (context, key, value, reviver) {
  if (Array.isArray(value)) {
    return reviver.call(context, key, reviveArray(value, reviver));
  }
  else if (value && typeof value === 'object') {
    return reviver.call(context, key, reviveObject(value, reviver))
  }
  else {
    return reviver.call(context, key, value)
  }
}

/**
 * Revive the properties of an object
 * @param {Object} object
 * @param {function} reviver
 * @return {Object}
 */
function reviveObject (object, reviver) {
  var revived = {};

  for (let key in object) {
    if (object.hasOwnProperty(key)) {
      revived[key] = reviveValue(object, key, object[key], reviver);
    }
  }

  return revived;
}

/**
 * Revive the properties of an Array
 * @param {Array} array
 * @param {function} reviver
 * @return {Array}
 */
function reviveArray (array, reviver) {
  var revived = [];

  for (let i = 0; i < array.length; i++) {
    revived[i] = reviveValue(array, i + '', array[i], reviver);
  }

  return revived;
}
