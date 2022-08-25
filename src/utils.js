/**
 * Test whether a string contains an integer number
 * @param {string} value
 * @returns {boolean}
 */
export function isInteger(value) {
  return /^[0-9]+$/.test(value)
}

/**
 * Test whether a string can be safely represented with a number
 * without information
 * @param {string} value
 * @returns {boolean}
 */
export function isSafeNumber(value) {
  const num = parseFloat(value)
  const str = String(num)

  // TODO: create an option to allow round-off errors or not

  function extractDigits(value) {
    return value
      .replace(EXPONENTIAL_PART_REGEX, '')
      .replace('.', '')
      .replace(TRAILING_ZEROS_REGEX, '')
      .replace(LEADING_MINUS_REGEX, '')
      .replace(LEADING_ZEROS_REGEX, '')
  }

  const v = extractDigits(value)
  const s = extractDigits(str)

  return v === s
}

const EXPONENTIAL_PART_REGEX = /[eE][+-]?\d+$/
const TRAILING_ZEROS_REGEX = /0+$/
const LEADING_ZEROS_REGEX = /^0+/
const LEADING_MINUS_REGEX = /^-/
