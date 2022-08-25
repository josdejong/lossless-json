import type { GenericObject, JSONValue, Reviver } from './types'

/**
 * Revive a json object.
 * Applies the reviver function recursively on all values in the JSON object.
 * @param json   A JSON Object, Array, or value
 * @param reviver
 *              A reviver function invoked with arguments `key` and `value`,
 *              which must return a replacement value. The function context
 *              (`this`) is the Object or Array that contains the currently
 *              handled value.
 */
export function revive (json: JSONValue, reviver: Reviver) : any {
  return reviveValue({'': json}, '', json, reviver)
}

/**
 * Revive a value
 */
function reviveValue (context: Object | Array<any>, key: string, value: any, reviver: Reviver) : any {
  if (Array.isArray(value)) {
    return reviver.call(context, key, reviveArray(value, reviver));
  }
  else if (value && typeof value === 'object' && !value.isLosslessNumber) {
    // note the special case for LosslessNumber,
    // we don't want to iterate over the internals of a LosslessNumber
    return reviver.call(context, key, reviveObject(value, reviver))
  }
  else {
    return reviver.call(context, key, value)
  }
}

/**
 * Revive the properties of an object
 */
function reviveObject (object: GenericObject<JSONValue>, reviver: Reviver) {
  Object.keys(object).forEach(key => {
    const value = reviveValue(object, key, object[key], reviver);
    if (value !== undefined) {
      object[key] = value
    } else {
      delete object[key]
    }
  })

  return object;
}

/**
 * Revive the properties of an Array
 */
function reviveArray (array: Array<JSONValue>, reviver: Reviver) : Array<any> {
  for (let i = 0; i < array.length; i++) {
    array[i] = reviveValue(array, i + '', array[i], reviver)
  }

  return array;
}
