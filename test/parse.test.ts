import Decimal from 'decimal.js'
import {
  isLosslessNumber,
  LosslessNumber,
  parse,
  parseNumberAndBigInt,
  reviveDate,
  stringify
} from '../src'
import { GenericObject, JSONValue } from '../src/types'

// helper function to create a lossless number
function lln(value: string) {
  return new LosslessNumber(value)
}

// deepEqual objects compared as plain JSON instead of JavaScript classes
function expectDeepEqual(a: unknown, b: unknown) {
  expect(jsonify(a)).toEqual(jsonify(b))
}

// turn a JavaScript object into plain JSON
function jsonify(obj: unknown): JSONValue {
  return JSON.parse(JSON.stringify(obj))
}

test('full JSON object', function () {
  const text = '{"a":2.3e100,"b":"str","c":null,"d":false,"e":[1,2,3]}'
  const expected: GenericObject<unknown> = {
    a: lln('2.3e100'),
    b: 'str',
    c: null,
    d: false,
    e: [lln('1'), lln('2'), lln('3')]
  }
  const parsed = parse(text)

  expect(jsonify(parsed)).toEqual(jsonify(expected))
})

test('object', function () {
  expect(parse('{}')).toEqual({})
  expect(parse('  { \n } \t ')).toEqual({})
  expect(parse('{"a": {}}')).toEqual({ a: {} })
  expect(parse('{"a": "b"}')).toEqual({ a: 'b' })
  expect(parse('{"a": 2}')).toEqual({ a: lln('2') })
})

test('array', function () {
  expect(parse('[]')).toEqual([])
  expect(parse('[{}]')).toEqual([{}])
  expect(parse('{"a":[]}')).toEqual({ a: [] })
  expect(parse('[1, "hi", true, false, null, {}, []]')).toEqual([
    lln('1'),
    'hi',
    true,
    false,
    null,
    {},
    []
  ])
})

test('number', function () {
  expect(isLosslessNumber(parse('2.3e500'))).toBe(true)
  expect(isLosslessNumber(parse('123456789012345678901234567890'))).toBe(true)
  expect(parse('23')).toEqual(lln('23'))
  expect(parse('0')).toEqual(lln('0'))
  expect(parse('0e+2')).toEqual(lln('0e+2'))
  expect(parse('0e+2').valueOf()).toEqual(0)
  expect(parse('0.0')).toEqual(lln('0.0'))
  expect(parse('-0')).toEqual(lln('-0'))
  expect(parse('2.3')).toEqual(lln('2.3'))
  expect(parse('2300e3')).toEqual(lln('2300e3'))
  expect(parse('2300e+3')).toEqual(lln('2300e+3'))
  expect(parse('-2')).toEqual(lln('-2'))
  expect(parse('2e-3')).toEqual(lln('2e-3'))
  expect(parse('2.3e-3')).toEqual(lln('2.3e-3'))
})

test('LosslessNumber', function () {
  const str = '22222222222222222222'
  expectDeepEqual(parse(str), lln(str))

  const str2 = '2.3e+500'
  expectDeepEqual(parse(str2), lln(str2))

  const str3 = '2.3e-500'
  expectDeepEqual(parse(str3), lln(str3))
})

test('string', function () {
  expect(parse('"str"')).toEqual('str')
  expect(JSON.parse('"\\"\\\\\\/\\b\\f\\n\\r\\t"')).toEqual('"\\/\b\f\n\r\t')
  expect(parse('"\\"\\\\\\/\\b\\f\\n\\r\\t"')).toEqual('"\\/\b\f\n\r\t')
  expect(JSON.parse('"\\u260E"')).toEqual('\u260E')
  expect(parse('"\\u260E"')).toEqual('\u260E')
})

test('keywords', function () {
  expect(parse('true')).toEqual(true)
  expect(parse('false')).toEqual(false)
  expect(parse('null')).toEqual(null)
})

test('reviver - replace values', function () {
  const text = '{"a":123,"b":"str"}'

  const expected = {
    type: 'object',
    value: {
      a: { type: 'object', value: lln('123') },
      b: { type: 'string', value: 'str' }
    }
  }

  function reviver(key: string, value: JSONValue) {
    return {
      type: typeof value,
      value
    }
  }

  expect(parse(text, reviver)).toEqual(expected)
})

test('reviver - invoke callbacks with key/value and correct context', function () {
  const text = '{"a":123,"b":"str","c":null,"22":22,"d":false,"e":[1,2,3]}'

  interface Log {
    context: JSONValue
    key: string
    value: JSONValue
  }

  const expected: Log[] = [
    {
      context: { 22: 22, a: 123, b: 'str', c: null, d: false, e: [1, 2, 3] },
      key: '22', // ordered first
      value: 22
    },
    {
      context: { 22: 22, a: 123, b: 'str', c: null, d: false, e: [1, 2, 3] },
      key: 'a',
      value: 123
    },
    {
      context: { 22: 22, a: 123, b: 'str', c: null, d: false, e: [1, 2, 3] },
      key: 'b',
      value: 'str'
    },
    {
      context: { 22: 22, a: 123, b: 'str', c: null, d: false, e: [1, 2, 3] },
      key: 'c',
      value: null
    },
    {
      context: { 22: 22, a: 123, b: 'str', c: null, d: false, e: [1, 2, 3] },
      key: 'd',
      value: false
    },
    {
      context: [1, 2, 3],
      key: '0',
      value: 1
    },
    {
      context: [1, 2, 3],
      key: '1',
      value: 2
    },
    {
      context: [1, null, 3],
      key: '2',
      value: 3
    },
    {
      context: { 22: 22, a: 123, b: 'str', c: null, e: [1, null, 3] },
      key: 'e',
      value: [1, null, 3]
    },
    {
      context: { '': { 22: 22, a: 123, b: 'str', c: null, e: [1, null, 3] } },
      key: '',
      value: { 22: 22, a: 123, b: 'str', c: null, e: [1, null, 3] }
    }
  ]

  // convert LosslessNumbers to numbers for easy comparison with native JSON
  function toRegularJSON(json: unknown) {
    return JSON.parse(stringify(json))
  }

  function reviver(key: string, value: JSONValue) {
    return key === 'd' ? undefined : key === '1' ? null : value
  }

  // validate expected outcome against reference implemenation JSON.parse
  const logsReference: Log[] = []
  JSON.parse(text, function (key, value) {
    logsReference.push({
      context: toRegularJSON(this),
      key,
      value
    })
    return reviver(key, value)
  })

  const logsActual: Log[] = []
  parse(text, function (key, value) {
    logsActual.push({
      context: toRegularJSON(this),
      key,
      value: toRegularJSON(value)
    })
    return reviver(key, value)
  })

  expect(logsReference).toEqual(expected)
  expect(logsActual).toEqual(expected)
})

test('correctly handle strings equaling a JSON delimiter', function () {
  expect(parse('""')).toEqual('')
  expect(parse('"["')).toEqual('[')
  expect(parse('"]"')).toEqual(']')
  expect(parse('"{"')).toEqual('{')
  expect(parse('"}"')).toEqual('}')
  expect(parse('":"')).toEqual(':')
  expect(parse('","')).toEqual(',')
})

test('reviver - revive a lossless number correctly', function () {
  const text = '2.3e+500'
  const expected = [{ key: '', value: lln('2.3e+500') }]
  const logs: Array<{ key: string; value: unknown }> = []

  parse(text, function (key, value) {
    logs.push({ key, value })
    return value
  })
  expectDeepEqual(logs, expected)
})

test('parse with a custom number parser creating bigint', () => {
  const json = parse('[123456789123456789123456789, 2.3, 123]', null, parseNumberAndBigInt)
  expect(json).toEqual([123456789123456789123456789n, 2.3, 123n])
})

test('parse with a reviver to parse Date', () => {
  const json = parse('["2022-08-25T09:39:19.288Z"]', reviveDate)
  expect(json).toEqual([new Date('2022-08-25T09:39:19.288Z')])
})

test('parse with a custom number parser creating Decimal', () => {
  const parseDecimal = (value: string) => new Decimal(value)

  const json = parse('[123456789123456789123456789,2.3,123]', null, parseDecimal)
  expect(json).toEqual([
    new Decimal('123456789123456789123456789'),
    new Decimal('2.3'),
    new Decimal('123')
  ])
})

test('throws an error when a duplicate key is encountered', () => {
  const text = '{"name": "Joe", "name": "Sarah"}'

  expect(() => parse(text)).toThrow("Duplicate key 'name' encountered at position 17")
})

test('does not throw a duplicate key error for build in methods like toString', () => {
  const text = '{"toString": "test"}'

  expect(parse(text)).toEqual({ toString: 'test' })
})

test('throw a duplicate key error when using a build in method name twice', () => {
  const text = '{"toString": 1, "toString": 2}'

  expect(() => parse(text)).toThrow("Duplicate key 'toString' encountered at position 17")
})

describe('throw meaningful exceptions', () => {
  const cases = [
    { input: '', expectedError: 'JSON value expected but reached end of input at position 0' },
    { input: '  ', expectedError: 'JSON value expected but reached end of input at position 2' },
    {
      input: '{',
      expectedError:
        "Quoted object key or end of object '}' expected but reached end of input at position 1"
    },
    {
      input: '{"a",',
      expectedError: "Colon ':' expected after property name but got ',' at position 4"
    },
    { input: '{a:2}', expectedError: "Quoted object key expected but got 'a' at position 1" },
    { input: '{"a":2,}', expectedError: "Quoted object key expected but got '}' at position 7" },
    {
      input: '{"a" "b"}',
      expectedError: "Colon ':' expected after property name but got '\"' at position 5"
    },
    {
      input: '{"a":2 "b":3}',
      expectedError: "Comma ',' expected after value but got '\"' at position 7"
    },
    { input: '{}{}', expectedError: "Expected end of input but got '{' at position 2" },
    {
      input: '[',
      expectedError:
        "Array item or end of array ']' expected but reached end of input at position 1"
    },
    { input: '[2,]', expectedError: "Array item expected but got ']' at position 3" },
    { input: '[2 3]', expectedError: "Comma ',' expected after value but got '3' at position 3" },
    { input: '2.3.4', expectedError: "Expected end of input but got '.' at position 3" },
    {
      input: '2..3',
      expectedError: "Invalid number '2.', expecting a digit but got '.' at position 2"
    },
    { input: '2e3.4', expectedError: "Expected end of input but got '.' at position 3" },
    {
      input: '2e',
      expectedError: "Invalid number '2e', expecting a digit but reached end of input at position 2"
    },
    {
      input: '-',
      expectedError: "Invalid number '-', expecting a digit but reached end of input at position 1"
    },
    {
      input: '"a',
      expectedError: "End of string '\"' expected but reached end of input at position 2"
    },
    { input: 'foo', expectedError: "JSON value expected but got 'f' at position 0" },
    { input: '"\\a"', expectedError: "Invalid escape character '\\a' at position 1" },
    { input: '"\\u26"', expectedError: "Invalid unicode character '\\u26' at position 1" },
    { input: '"\\uZ000"', expectedError: "Invalid unicode character '\\uZ000' at position 1" }
  ]

  cases.forEach(({ input, expectedError }) => {
    test(`should throw when parsing '${input}'`, () => {
      expect(() => parse(input)).toThrow(expectedError)
    })
  })
})
