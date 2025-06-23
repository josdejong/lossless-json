import { Bench } from 'tinybench'
import { toLosslessNumber } from '../../lib/esm/LosslessNumber.js'
import { getUnsafeNumberReason, isSafeNumber, toSafeNumberOrThrow } from '../../lib/esm/utils.js'

const values = [
  '2.345',
  '23e4',
  '230000',
  '-77',
  '0.003400',
  '120.5e+30',
  '120.5e-30',
  '0120.50E-30',
  '81200',
  '-81200',
  '3.14159265358979'
]

const nums = values.map(Number.parseFloat)

const bench = new Bench({ time: 100 })
  .add('toLosslessNumber', () => nums.map((value) => toLosslessNumber(value)))
  .add('isSafeNumber', () => values.map((value) => isSafeNumber(value)))
  .add('toSafeNumberOrThrow', () => values.map((value) => toSafeNumberOrThrow(value)))
  .add('getUnsafeNumberReason', () => values.map((value) => getUnsafeNumberReason(value)))

await bench.run()

console.log(bench.name)
console.table(bench.table())
