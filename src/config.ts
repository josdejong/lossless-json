interface ConfigOptional {
  circularRefs?: boolean
}

interface Config extends ConfigOptional {
  circularRefs: boolean
}

/**
 * Get and/or set configuration options
 * @deprecated There is no config anymore
 */
export function config(_options?: ConfigOptional): Config {
  // Backward compatibility warning for v1.x
  throw new Error(
    'config is deprecated, support for circularRefs is removed from the library. ' +
      'If you encounter circular references in your data structures, ' +
      'please rethink your datastructures: ' +
      'better prevent circular references in the first place.'
  )
}
