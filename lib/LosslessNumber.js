'use strict';

/**
 * A lossless number. Stores it's value as string
 * @param {string | number} value
 * @constructor
 */
export class LosslessNumber {
  constructor (value) {
    if (typeof value === 'string') {
      if (!isValidNumber(value)) {
        throw new Error('Invalid number (value: "' + value +'")');
      }

      this.value = value;
    }
    else if (typeof value === 'number') {
      // validate number
      if (getDigits(value + '').length > 15) {
        throw new Error('Invalid number: contains more than 15 digits (value: ' + value + ')');
      }
      if (isNaN(value)) {
        throw new Error('Invalid number: NaN');
      }
      if (!isFinite(value)) {
        throw new Error('Invalid number: Infinity');
      }

      this.value = value + '';
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
    let digits = getDigits(this.value);

    // throw an error when the numeric value will lose information
    if (digits.length > 15) {
      throw new Error('Cannot convert to number: ' +
          'value contains more than 15 digits (value: ' + this.value + ')');
    }
    if (!isFinite(number)) {
      throw new Error('Cannot convert to number: number overflow (value: ' + this.value + ')');
    }
    if (Math.abs(number) < Number.MIN_VALUE && !containsOnlyZeros(digits)) {
      throw new Error('Cannot convert to number: number underflow (value: ' + this.value + ')');
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
 * Parse a string into a number. When the value can be represented in a number,
 * the function returns a number. Else, the function returns a LosslessNumber
 * @param {string} value
 * @returns {LosslessNumber | number} Returns a number when the value fits
 *                                    in a regular number, else returns a
 *                                    LosslessNumber.
 */
export function createNumber (value) {
  let digits = getDigits(value);

  if (digits.length > 15) {
    // would truncate digits
    return new LosslessNumber(value);
  }

  let number = parseFloat(value);
  if (!isFinite(number)) {
    // overflow, finite or NaN
    return new LosslessNumber(value);
  }
  else if (Math.abs(number) < Number.MIN_VALUE && !containsOnlyZeros(digits)) {
    // underflow
    return new LosslessNumber(value);
  }
  else {
    return number;
  }
}

/**
 * Count the number of significant digits of a number.
 *
 * For example:
 *   '2.34' returns '234'
 *   '-77' returns '77'
 *   '0.0034' returns '34'
 *   '120.5e+30' returns '1205'
 *
 * @param {number | string} value
 * @return {string} Returns the significant digits
 */
export function getDigits (value) {
  let _value = (typeof value !== 'string') ? (value + '') : value;

  return _value
      .replace(/^-/, '')            // remove sign
      .replace(/e.*$/, '')          // remove exponential notation
      .replace( /^0\.?0*|\./, '');  // remove decimal point and leading zeros
}

/**
 * Test whether a string contains only zeros or is empty
 * @param {string} text
 * @return {boolean}
 */
export function containsOnlyZeros (text) {
  return /^0*$/.test(text);
}

/**
 * Test whether a string contains a valid number
 * http://stackoverflow.com/questions/13340717/json-numbers-regular-expression
 * @param {string} value
 * @return {boolean}
 */
export function isValidNumber(value) {
  return /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/.test(value);
}
