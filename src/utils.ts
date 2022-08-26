/**
 * Test whether a string contains an integer number
 */
export function isInteger(value: string): boolean {
  return /^-?[0-9]+$/.test(value)
}

/**
 * Test whether a string contains a number
 * http://stackoverflow.com/questions/13340717/json-numbers-regular-expression
 */
export function isNumber(value: string): boolean {
  return /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/.test(value)
}

/**
 * Test whether a string can be safely represented with a number
 * without information
 */
export function isSafeNumber(value: string): boolean {
  const num = parseFloat(value)
  const str = String(num)

  // TODO: create an option to allow round-off errors or not

  const v = extractSignificantDigits(value)
  const s = extractSignificantDigits(str)

  return v === s
}

/**
 * Get the significant digits of a number.
 *
 * For example:
 *   '2.34' returns '234'
 *   '-77' returns '77'
 *   '0.003400' returns '34'
 *   '120.5e+30' returns '1205'
 **/
export function extractSignificantDigits(value: string): string {
  return (
    value
      // from "-0.250e+30" to "-0.250"
      .replace(EXPONENTIAL_PART_REGEX, '')

      // from "-0.250" to "-0250"
      .replace(DOT_REGEX, '')

      // from "-0250" to "-025"
      .replace(TRAILING_ZEROS_REGEX, '')

      // from "-025" to "25"
      .replace(LEADING_MINUS_AND_ZEROS_REGEX, '')
  )
}

const EXPONENTIAL_PART_REGEX = /[eE][+-]?\d+$/
const LEADING_MINUS_AND_ZEROS_REGEX = /^-?(0*)?/
const DOT_REGEX = /\./
const TRAILING_ZEROS_REGEX = /0+$/
