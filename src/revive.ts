import { isLosslessNumber } from './LosslessNumber.js'
import type { GenericObject, Reviver } from './types'

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
export function revive(json: unknown, reviver: Reviver): unknown {
  return reviveValue({ '': json }, '', json, reviver)
}

/**
 * Revive a value
 */
function reviveValue(
  context: GenericObject<unknown> | Array<unknown>,
  key: string,
  value: unknown,
  reviver: Reviver
): unknown {
  if (Array.isArray(value)) {
    return reviver.call(context, key, reviveArray(value, reviver))
  } else if (value && typeof value === 'object' && !isLosslessNumber(value)) {
    // note the special case for LosslessNumber,
    // we don't want to iterate over the internals of a LosslessNumber
    return reviver.call(
      context,
      key,
      reviveObject(value as unknown as GenericObject<unknown>, reviver)
    )
  } else {
    return reviver.call(context, key, value)
  }
}

/**
 * Revive the properties of an object
 */
function reviveObject(object: GenericObject<unknown>, reviver: Reviver) {
  Object.keys(object).forEach((key) => {
    const value = reviveValue(object, key, object[key], reviver)
    if (value !== undefined) {
      object[key] = value
    } else {
      delete object[key]
    }
  })

  return object
}

/**
 * Revive the properties of an Array
 */
function reviveArray(array: Array<unknown>, reviver: Reviver): Array<unknown> {
  for (let i = 0; i < array.length; i++) {
    array[i] = reviveValue(array, i + '', array[i], reviver)
  }

  return array
}
