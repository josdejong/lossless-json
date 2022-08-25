import { LosslessNumber } from './LosslessNumber.js'
import { isInteger } from './utils.js'

/**
 * @param {string} value
 * @returns {LosslessNumber}
 */
export function parseLosslessNumber (value) {
  return new LosslessNumber(value)
}

/**
 * @param {string} value
 * @returns {number | bigint}
 */
export function parseNumberAndBigInt (value) {
  return isInteger(value)
    ? BigInt(value)
    : parseFloat(value)
}
