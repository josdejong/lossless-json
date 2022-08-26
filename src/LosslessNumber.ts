import { extractSignificantDigits, isNumber, toSafeNumberOrThrow } from './utils.js'

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
   * Throws an Error when this would result in loss of information: when digits
   * of an integer or decimal would be truncated, or when the number would
   * overflow or underflow.
   *
   * See also .approxValueOf() and .unsafeValueOf()
   */
  valueOf(): number {
    return toSafeNumberOrThrow(this.value)
  }

  /**
   * Get the value of the LosslessNumber as number.
   * Throws an Error when this would result in loss of information: when digits
   * of an integer would be truncated, or when the number would overflow or
   * underflow. Unlike .valueOf(), this method will allow losing insignificant
   * digits of a decimal value.
   *
   * See also .valueOf() and .unsafeValueOf()
   */
  approxValueOf(): number {
    return toSafeNumberOrThrow(this.value, { approx: true })
  }

  /**
   * Get the value of the LosslessNumber as number.
   * Will always return a number, also when this results in loss of digits.
   *
   * See also .valueOf() and .approxValueOf()
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

/**
 * Test whether a value is a LosslessNumber
 */
export function isLosslessNumber(value: unknown): value is LosslessNumber {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return (value && typeof value === 'object' && value.isLosslessNumber === true) || false
}

/**
 * Convert a number into a LosslessNumber if this is possible in a safe way
 * If the value has too many digits, or is NaN or Infinity, an error will be thrown
 */
export function toLosslessNumber(value: number): LosslessNumber {
  if (extractSignificantDigits(value + '').length > 15) {
    throw new Error('Invalid number: contains more than 15 digits (value: ' + value + ')')
  }

  if (isNaN(value)) {
    throw new Error('Invalid number: NaN')
  }

  if (!isFinite(value)) {
    throw new Error('Invalid number: ' + value)
  }

  return new LosslessNumber(String(value))
}
