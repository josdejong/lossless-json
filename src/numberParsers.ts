import { LosslessNumber } from './LosslessNumber.js'
import { isInteger } from './utils.js'

export function parseLosslessNumber(value: string): LosslessNumber {
  return new LosslessNumber(value)
}

export function parseNumberAndBigInt(value: string): number | bigint {
  return isInteger(value) ? BigInt(value) : parseFloat(value)
}
