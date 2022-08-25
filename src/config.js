/**
 * Get and/or set configuration options
 * @param {{circularRefs?: boolean, parseNumber?: (text: string) => any}} [options]
 * @return {{circularRefs: boolean, parseNumber: (text: string) => any}}
 * @deprecated There is no config anymore
 */
export function config (options) {
  // Backward compatibility warning for v1.x
  throw new Error(
    'config is deprecated, support for circularRefs is removed from the library. ' +
    'If you encounter circular references in your data structures, ' +
    'please rethink your datastructures: ' +
    'better prevent circular references in the first place.')
}
