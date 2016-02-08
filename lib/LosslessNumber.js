'use strict';

/**
 * A lossless number. Stores it's value as string
 * @param {string | number} value
 * @constructor
 */
export class LosslessNumber {
  constructor (value) {
    if (typeof value === 'string') {
      // TODO: test whether value contains a valid number
      this.value = value;
    }
    else if (typeof value === 'number') {
      // TODO: test whether the number has no more than 15 digits, else throw error
      this.value = String(value);
    }
    else {
      throw new TypeError('String or number expected');
    }

    // type information
    this.type = 'LosslessNumber';
    this.isLosslessNumber = true;
  }

  /**
   * Get the value of the LosslessNumber as number.
   * Will throw an error when this conversion would result in a truncation
   * of the number.
   * @return {Number}
   */
  valueOf () {
    // TODO: throw an error when the numeric value will lose information

    return parseFloat(this.value);
  }

  /**
   * Get the string representation of the lossless number
   * @return {string}
   */
  toString() {
    return this.value;
  }


}
