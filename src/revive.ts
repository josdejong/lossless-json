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
    if (value !== undefined) {
      object[key] = value
    } else {
      delete object[key]
    }
  }

  return object
}

/**
 * Revive the properties of an Array
 */
function reviveArray(array: Array<unknown>, reviver: Reviver): Array<unknown> {
  for (let i = 0; i < array.length; i++) {
    const value = reviveValue(array, String(i), array[i], reviver)

    if (value === undefined) {
      // Remove the own property entirely, like native JSON.parse does: the
      // position becomes a genuine hole (no own key, and `Object.keys` omits
      // it) while the length stays unchanged. Assigning `array[i] = undefined`
      // would leave an own property holding `undefined` instead.
      delete array[i]
    } else {
      // Assign right away rather than after the loop: the reviver observes the
      // holder through `this`, so later items must see the already revived
      // values (e.g. a preceding `null` replacement).
      array[i] = value
    }
  }

  return array
}
