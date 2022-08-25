import { parse, stringify, LosslessNumber } from '../src'

test('Public API', function () {
  expect(parse('{}')).toEqual({})
  expect(stringify({})).toEqual('{}')
  expect(new LosslessNumber('2').isLosslessNumber).toBe(true)
})
