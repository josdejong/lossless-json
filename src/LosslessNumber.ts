import { isNumber, isSafeNumber } from './utils.js'

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
