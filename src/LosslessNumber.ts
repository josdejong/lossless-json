import { isSafeNumber, isNumber } from './utils.js'

/**
 * A lossless number. Stores its numeric value as string
 */
export class LosslessNumber {
  value: string
  type: 'LosslessNumber'
  isLosslessNumber: true

  constructor(value: string) {
    if (!isNumber(value)) {
      throw new Error('Invalid number (value: "' + value + '")')
    }

    // numeric value as string
    this.value = value

    // type information
    this.type = 'LosslessNumber'
    this.isLosslessNumber = true
  }

  /**
   * Get the value of the LosslessNumber as number.
   * Will throw an error when this conversion would result in a truncation
   * of the number.
   */
  valueOf(): number {
    const number = parseFloat(this.value)

    if (!isSafeNumber(this.value)) {
      throw new Error(
        'Cannot safely convert LosslessNumber to number: ' +
          `"${this.value}" will be parsed as ${number} and lose information`
      )
    }

    return number
  }

  /**
   * Get the value of the LosslessNumber as number.
   * Will always return a number, also when this results in loss of digits.
   * @return {Number}
   */
  unsafeValueOf(): number {
    return parseFloat(this.value)
  }

  /**
   * Get the value of the LosslessNumber as string.
   */
  toString(): string {
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
    if (!isNumber(value)) {
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
