'use strict';

/**
 * A lossless number. Stores it's value as string
 * @param {string | number} value
 * @constructor
 */
export class LosslessNumber {
  constructor (value) {
    if (typeof value === 'string') {
      if (!isNumber(value)) {
        throw new Error('Invalid number (value: "' + value +'")');
      }

      this.value = value;
    }
    else if (typeof value === 'number') {
      // validate number
      if (digits(value) > 15) {
        throw new Error('Invalid number: contains more than 15 digits (value: ' + value + ')');
      }
      if (isNaN(value)) {
        throw new Error('Invalid number: NaN');
      }
      if (!isFinite(value)) {
        throw new Error('Invalid number: Infinity');
      }

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
    let number = parseFloat(this.value);

    // throw an error when the numeric value will lose information
    if (digits(this.value) > 15) {
      throw new Error('Cannot convert to number: ' +
          'value contains more than 15 digits (value: ' + this.value + ')');
    }
    if (!isFinite(number)) {
      throw new Error('Cannot convert to number: number overflow (value: ' + this.value + ')');
    }

    return number;
  }

  /**
   * Get the string representation of the lossless number
   * @return {string}
   */
  toString() {
    return this.value;
  }

}

/**
 * Count the number of significant digits of a number.
 *
 * For example:
 *   2.34 returns 3
 *   0.0034 returns 2
 *   120.5e+30 returns 4
 *
 * @param {number | string} value
 * @return {number} digits   Number of significant digits
 */
function digits (value) {
  if (typeof value === 'number') {
    return digits(value.toExponential());
  }
  else { // typeof value === 'string'
    return value
        .replace(/e.*$/, '')          // remove exponential notation
        .replace( /^0\.?0*|\./, '')   // remove decimal point and leading zeros
        .length;
  }
}

/**
 * Test whether a string contains a valid number
 * http://stackoverflow.com/questions/13340717/json-numbers-regular-expression
 * @param {string} value
 * @return {boolean}
 */
function isNumber(value) {
  return /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/.test(value);
}
