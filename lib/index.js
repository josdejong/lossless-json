'use strict';

export * from './parse';
export * from './stringify';
import { LosslessNumber } from './LosslessNumber';

export function losslessNumber (value) {
  return new LosslessNumber(value);
}
