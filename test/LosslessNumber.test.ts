import { isLosslessNumber, LosslessNumber, toLosslessNumber } from '../src'

test('create a LosslessNumber from string', function () {
  const n = new LosslessNumber('42')
  expect(n.isLosslessNumber).toBe(true)
  expect(n.value).toBe('42')
})

test('throw an error when when creating a LosslessNumber from invalid string', function () {
  // invalid
  expect(() => new LosslessNumber('a')).toThrow(/Invalid number/)
  expect(() => new LosslessNumber('22.')).toThrow(/Invalid number/)
  expect(() => new LosslessNumber('0.2e')).toThrow(/Invalid number/)
  expect(() => new LosslessNumber('2e3.4')).toThrow(/Invalid number/)
  expect(() => new LosslessNumber('2.3.4')).toThrow(/Invalid number/)
  expect(() => new LosslessNumber('+24')).toThrow(/Invalid number/)

  // valid
  expect(new LosslessNumber('42e+4').toString()).toEqual('42e+4')
  expect(new LosslessNumber('42E-4').toString()).toEqual('42E-4')
  expect(new LosslessNumber('-42E-4').toString()).toEqual('-42E-4')
})

test('test whether something is a LosslessNumber', function () {
  const n = new LosslessNumber('42')
  expect(isLosslessNumber(n)).toBe(true)
  expect(isLosslessNumber(42)).toBe(false)
  expect(isLosslessNumber(null)).toBe(false)
  expect(isLosslessNumber({})).toBe(false)
  expect(isLosslessNumber([])).toBe(false)
  expect(isLosslessNumber(undefined)).toBe(false)
})

test('create a LosslessNumber from number', function () {
  expect(toLosslessNumber(42)).toEqual(new LosslessNumber('42'))
  expect(toLosslessNumber(2.47)).toEqual(new LosslessNumber('2.47'))

  expect(() => toLosslessNumber(2 / 3)).toThrow('Invalid number: contains more than 15 digits')
  expect(() => toLosslessNumber(NaN)).toThrow('Invalid number: NaN')
  expect(() => toLosslessNumber(Infinity)).toThrow('Invalid number: Infinity')
  expect(() => toLosslessNumber(-Infinity)).toThrow('Invalid number: -Infinity')
})

test('use LosslessNumber.valueOf()', function () {
  expect(new LosslessNumber('23.4').valueOf()).toBe(23.4)
  expect(new LosslessNumber('23e4').valueOf()).toBe(230000)

  expect(() => new LosslessNumber('123456789012345678901234').valueOf()).toThrow(
    'Cannot safely convert LosslessNumber to number: "123456789012345678901234" will be parsed as 1.2345678901234569e+23 and lose information'
  )
  expect(() => new LosslessNumber('2.3e+500').valueOf()).toThrow(
    'Cannot safely convert LosslessNumber to number: "2.3e+500" will be parsed as Infinity and lose information'
  )
  expect(() => new LosslessNumber('2.3e-500').valueOf()).toThrow(
    'Cannot safely convert LosslessNumber to number: "2.3e-500" will be parsed as 0 and lose information'
  )
})

test('use LosslessNumber.unsafeValueOf()', function () {
  expect(new LosslessNumber('23.4').unsafeValueOf()).toBe(23.4)
  expect(new LosslessNumber('23e4').unsafeValueOf()).toBe(230000)
  expect(new LosslessNumber('123456789012345678901234').unsafeValueOf()).toBe(1.2345678901234569e23)
  expect(new LosslessNumber('2.3e+500').unsafeValueOf()).toBe(Infinity)
  expect(new LosslessNumber('2.3e-500').unsafeValueOf()).toBe(0)
})

test('can do operations like add a number and a LosslessNumber', () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  expect(new LosslessNumber('3') + 2).toBe(5)
})

test('LosslessNumber - toString', function () {
  expect(new LosslessNumber('23.4').toString()).toBe('23.4')
})
