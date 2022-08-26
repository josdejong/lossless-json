import { extractSignificantDigits, isNumber, isSafeNumber } from './utils.js'

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
    const number = this.unsafeValueOf()

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
