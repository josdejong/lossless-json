import { parseJSONPointer as parsePointer } from './jsonPointer.js'

export function resolveCircularReferences(json) {
  let path = [];  // keys on the current stack
  let stack = []; // objects (Object or Array) on the current stack

  return resolve(json)

  function resolve(json) {
    return resolveArray(json) ?? resolveObject(json) ?? json
  }

  function resolveObject(object) {
    if (object && typeof object === 'object' && !Array.isArray(object)) {
      // check whether this is a circular reference
      if (isCircularReference(object)) {
        console.log('isCircular', { stack, path, object })
        return parseCircular(object)
      }

      // add this object to the stack
      const stackIndex = stack.length
      stack[stackIndex] = object

      Object.keys(object).forEach(key => {
        path[stackIndex] = key
        object[key] = resolve(object[key])
      })

      // remove current entry from the stack
      stack.length = stackIndex;
      path.length = stackIndex;

      return object
    }
  }

  function resolveArray(array) {
    if (Array.isArray(array)) {
      // add this array to the stack
      const stackIndex = stack.length
      stack[stackIndex] = array

      array.forEach((item, index) => {
        path[stackIndex] = String(index)
        array[index] = resolve(item)
      })

      // remove current entry from the stack
      stack.length = stackIndex
      path.length = stackIndex

      return array
    }
  }

  /**
   * Test whether an object is a circular reference, like {$ref: '#/foo/bar'}
   * @param {Object} object
   * @return {boolean}
   */
  function isCircularReference (object) {
    return typeof object.$ref === 'string' && Object.keys(object).length === 1;
  }

  /**
   * Resolve a circular reference.
   * Throws an error if the path cannot be resolved
   * @param {Object} object    An object with a JSON Pointer URI fragment
   *                           like {$ref: '#/foo/bar'}
   * @return {Object | Array}
   */
  function parseCircular(object) {
    let pointerPath = parsePointer(object.$ref);
    console.log('pointerPath', pointerPath, stack)

    // validate whether the path corresponds with current stack
    for (let i = 0; i < pointerPath.length; i++) {
      if (pointerPath[i] !== path[i]) {
        throw new Error('Invalid circular reference "' +  object.$ref + '"');
      }
    }

    return stack[pointerPath.length];
  }
}
