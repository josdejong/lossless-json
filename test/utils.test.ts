import { extractSignificantDigits, isInteger, isNumber, isSafeNumber, repeat } from '../src/utils'

test('isInteger', () => {
  expect(isInteger('4250')).toEqual(true)
  expect(isInteger('-4250')).toEqual(true)
  expect(isInteger('2.345')).toEqual(false)
})

test('isNumber', () => {
  expect(isNumber('4250')).toEqual(true)
  expect(isNumber('-4250')).toEqual(true)
  expect(isNumber('2.345')).toEqual(true)
  expect(isNumber('2.345e3')).toEqual(true)
  expect(isNumber('2.345e+3')).toEqual(true)
  expect(isNumber('2.345e-3')).toEqual(true)
  expect(isNumber('2.3450e-3')).toEqual(true)
  expect(isNumber('-2.3450e-3')).toEqual(true)
})

test('isSafeNumber', () => {
  expect(isSafeNumber('2.3')).toEqual(true)
  expect(isSafeNumber('2.3e4')).toEqual(true)
  expect(isSafeNumber('1234567890')).toEqual(true)

  expect(isSafeNumber('2e500')).toEqual(false)
  expect(isSafeNumber('2e-500')).toEqual(false)
  expect(isSafeNumber('0.66666666666666666667')).toEqual(false)
  expect(isSafeNumber('12345678901234567890')).toEqual(false)
})

test('extractSignificantDigits', () => {
  expect(extractSignificantDigits('2.345')).toEqual('2345')
  expect(extractSignificantDigits('23e4')).toEqual('23')
  expect(extractSignificantDigits('230000')).toEqual('23')
  expect(extractSignificantDigits('-77')).toEqual('77')
  expect(extractSignificantDigits('0.003400')).toEqual('34')
  expect(extractSignificantDigits('120.5e+30')).toEqual('1205')
  expect(extractSignificantDigits('120.5e-30')).toEqual('1205')
  expect(extractSignificantDigits('0120.50E-30')).toEqual('1205')
  expect(extractSignificantDigits('01200')).toEqual('12')
  expect(extractSignificantDigits('-01200')).toEqual('12')
})

test('repeat', () => {
  expect(repeat('hi', 3)).toEqual('hihihi')
  expect(repeat('hi', 0)).toEqual('')
  expect(repeat('hi', -2)).toEqual('')
})
