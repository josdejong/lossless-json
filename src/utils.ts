/**
 * Test whether a string contains an integer number
 */
export function isInteger (value: string) : boolean {
  return /^[0-9]+$/.test(value)
}

/**
 * Test whether a string contains a valid number
 * http://stackoverflow.com/questions/13340717/json-numbers-regular-expression
 */
export function isValidNumber (value: string) : boolean {
  return /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/.test(value)
}

/**
 * Test whether a string can be safely represented with a number
 * without information
 */
export function isSafeNumber (value: string) : boolean {
  const num = parseFloat(value)
  const str = String(num)

  // TODO: create an option to allow round-off errors or not

  function extractDigits (value: string) : string {
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

/**
 * Repeat a string a number of times.
 * Simple linear solution, we only need up to 10 iterations in practice
 */
export function repeat (text: string, times: number) : string {
  let res = ''
  while (times-- > 0) {
    res += text
  }
  return res
}
