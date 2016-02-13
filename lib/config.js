
let circularRefs = true;

/**
 * Get and/or set configuration options
 * @param {{circularRefs: boolean}} [options]
 * @retrun {{circularRefs: boolean}}
 */
export function config (options) {
  if (options) {
    if (options.circularRefs != undefined) {
      circularRefs = (options.circularRefs === true);
    }
  }

  return { circularRefs }
}
