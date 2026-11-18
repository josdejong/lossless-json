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
  }

  if (value && typeof value === 'object' && !isLosslessNumber(value)) {
    // note the special case for LosslessNumber,
    // we don't want to iterate over the internals of a LosslessNumber
    return reviver.call(context, key, reviveObject(value as GenericObject<unknown>, reviver))
  }

  return reviver.call(context, key, value)
}

/**
 * Revive the properties of an object
 */
function reviveObject(object: GenericObject<unknown>, reviver: Reviver) {
  for (const key of Object.keys(object)) {
    const value = reviveValue(object, key, object[key], reviver)
    updateProperty(object, key, value)
  }

  return object
}

/**
 * Revive the properties of an Array
 */
function reviveArray(array: Array<unknown>, reviver: Reviver): Array<unknown> {
  // A reviver can introduce an array proxy with a non-number length. Read and
  // coerce it once, using the same range as JSON.parse's LengthOfArrayLike.
  const length = Math.min(Math.max(Math.trunc(+array.length) || 0, 0), Number.MAX_SAFE_INTEGER)
  for (let i = 0; i < length; i++) {
    const value = reviveValue(array, String(i), array[i], reviver)
    updateProperty(array, String(i), value)
  }

  return array
}

/**
 * Apply a reviver result using the property operations of JSON.parse.
 * A refused update or deletion is ignored, but an exception still propagates.
 */
function updateProperty(object: object, key: string, value: unknown): void {
  if (value === undefined) {
    Reflect.deleteProperty(object, key)
  } else {
    Reflect.defineProperty(object, key, {
      value,
      writable: true,
      enumerable: true,
      configurable: true
    })
  }
}
