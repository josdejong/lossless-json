import { isValidNumber } from './utils.js'

/**
 * A lossless number. Stores its value as string
 */
export class LosslessNumber {
  value: string
  type: 'LosslessNumber'
  isLosslessNumber: true

  constructor(value: unknown) {
    // value as string
    this.value = valueToString(value)

    // type information
    this.type = 'LosslessNumber'
    this.isLosslessNumber = true
  }

  /**
   * Get the value of the LosslessNumber as number.
   * Will throw an error when this conversion would result in a truncation
   * of the number.
   * @return {Number}
   */
  valueOf() {
    const number = parseFloat(this.value)
    const digits = getDigits(this.value)

    // throw an error when the numeric value will lose information
    if (digits.length > 15) {
      throw new Error(
        'Cannot convert to number: ' + 'number would be truncated (value: ' + this.value + ')'
      )
    }
    if (!isFinite(number)) {
      throw new Error('Cannot convert to number: number would overflow (value: ' + this.value + ')')
    }
    if (Math.abs(number) < Number.MIN_VALUE && !containsOnlyZeros(digits)) {
      throw new Error(
        'Cannot convert to number: number would underflow (value: ' + this.value + ')'
      )
    }

    return number
  }

  /**
   * Get the value of the LosslessNumber as string.
   * @return {string}
   */
  toString() {
    return this.value
  }
}

export function isLosslessNumber(value: unknown): value is LosslessNumber {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return (value && typeof value === 'object' && value.isLosslessNumber === true) || false
}

/**
 * Convert input value to a string
 * If value is no number or string, the valueOf() of the object will be used.
 */
export function valueToString(value: unknown): string {
  if (typeof value === 'string') {
    if (!isValidNumber(value)) {
      throw new Error('Invalid number (value: "' + value + '")')
    }

    return value
  } else if (typeof value === 'number') {
    // validate number
    if (getDigits(value + '').length > 15) {
      throw new Error('Invalid number: contains more than 15 digits (value: ' + value + ')')
    }
    if (isNaN(value)) {
      throw new Error('Invalid number: NaN')
    }
    if (!isFinite(value)) {
      throw new Error('Invalid number: Infinity')
    }

    return value + ''
  } else {
    return valueToString(value && value.valueOf())
  }
}

/**
 * Parse a string into a number. When the value can be represented in a number,
 * the function returns a number. Else, the function returns a LosslessNumber
 * @param value
 * @returns Returns a number when the value fits in a regular number,
 *          else returns a LosslessNumber.
 */
export function createNumber(value: string): LosslessNumber | number {
  const digits = getDigits(value)

  if (digits.length > 15) {
    // would truncate digits
    return new LosslessNumber(value)
  }

  const number = parseFloat(value)
  if (!isFinite(number)) {
    // overflow, finite or NaN
    return new LosslessNumber(value)
  } else if (Math.abs(number) < Number.MIN_VALUE && !containsOnlyZeros(digits)) {
    // underflow
    return new LosslessNumber(value)
  } else {
    return number
  }
}

/**
 * Get the significant digits of a number.
 *
 * For example:
 *   '2.34' returns '234'
 *   '-77' returns '77'
 *   '0.0034' returns '34'
 *   '120.5e+30' returns '1205'
 **/
export function getDigits(value: number | string): string {
  const _value = typeof value !== 'string' ? value + '' : value

  return _value
    .replace(/^-/, '') // remove sign
    .replace(/e.*$/, '') // remove exponential notation
    .replace(/^0\.?0*|\./, '') // remove decimal point and leading zeros
}

/**
 * Test whether a string contains only zeros or is empty
 */
export function containsOnlyZeros(text: string): boolean {
  return /^0*$/.test(text)
}
