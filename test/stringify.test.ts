import Decimal from 'decimal.js'
import { LosslessNumber, stringify } from '../src'
import type { GenericObject, JSONValue } from '../src/types'

// helper function to create a lossless number
function lln(value: string) {
  return new LosslessNumber(value)
}

test('stringify', function () {
  expect(stringify(undefined)).toEqual(undefined)

  expect(stringify(null)).toEqual('null')

  expect(stringify(true)).toEqual('true')
  expect(stringify(false)).toEqual('false')
  // eslint-disable-next-line no-new-wrappers
  expect(stringify(new Boolean(true))).toEqual('true')
  // eslint-disable-next-line no-new-wrappers
  expect(stringify(new Boolean(false))).toEqual('false')

  expect(stringify(2.3)).toEqual('2.3')
  // eslint-disable-next-line no-new-wrappers
  expect(stringify(new Number(2.3))).toEqual('2.3')
  expect(stringify(-2.3)).toEqual('-2.3')
  expect(stringify(Infinity)).toEqual('null')
  expect(stringify(NaN)).toEqual('null')

  expect(stringify('str')).toEqual('"str"')
  // eslint-disable-next-line no-new-wrappers
  expect(stringify(new String('str'))).toEqual('"str"')
  expect(stringify('"')).toEqual('"\\""')
  expect(stringify('\\')).toEqual('"\\\\"')
  expect(stringify('\b')).toEqual('"\\b"')
  expect(stringify('\f')).toEqual('"\\f"')
  expect(stringify('\n')).toEqual('"\\n"')
  expect(stringify('\r')).toEqual('"\\r"')
  expect(stringify('\t')).toEqual('"\\t"')
  expect(stringify('"\\/\b\f\n\r\t')).toEqual('"\\"\\\\/\\b\\f\\n\\r\\t"')

  // validate expected outcome against native JSON.stringify
  expect(JSON.stringify('"\\/\b\f\n\r\t')).toEqual('"\\"\\\\/\\b\\f\\n\\r\\t"')

  expect(stringify(new Date('2016-02-08T14:00:00Z'))).toEqual('"2016-02-08T14:00:00.000Z"')

  expect(
    stringify([
      2,
      'str',
      null,
      undefined,
      true,
      function () {
        console.log('test')
      }
    ])
  ).toEqual('[2,"str",null,null,true,null]')

  expect(
    stringify({
      a: 2,
      b: 'str',
      c: null,
      d: undefined,
      e: function () {
        console.log('test')
      }
    })
  ).toEqual('{"a":2,"b":"str","c":null}')

  expect(stringify({ '\\\\d': 1 })).toEqual('{"\\\\\\\\d":1}')

  // validate exepected outcome against native JSON.stringify
  expect(JSON.stringify({ '\\\\d': 1 })).toEqual('{"\\\\\\\\d":1}')

  expect(
    stringify({
      a: 2,
      toJSON: function () {
        return 'foo'
      }
    })
  ).toEqual('"foo"')

  // TODO: Symbol
  // TODO: ignore non-enumerable properties
})

test('stringify a full JSON object', function () {
  const expected = '{"a":123,"b":"str","c":null,"d":false,"e":[1,2,3]}'
  const json: GenericObject<unknown> = { a: lln('123'), b: 'str', c: null, d: false, e: [1, 2, 3] }

  const stringified = stringify(json)

  expect(stringified).toEqual(expected)
})

test('stringify bigint', function () {
  expect(stringify(123n)).toEqual('123')
  expect(stringify({ bigint: 123n })).toEqual('{"bigint":123}')
})

test('stringify Date', function () {
  expect(stringify([new Date('2022-08-25T09:39:19.288Z')])).toEqual('["2022-08-25T09:39:19.288Z"]')
})

test('stringify Decimal', function () {
  const decimalStringifier = {
    test: (value: string) => Decimal.isDecimal(value),
    stringify: (value: string) => value.toString()
  }
  const numberStringifiers = [decimalStringifier]

  const a = new Decimal('123456789123456789123456789')

  expect(stringify(a, undefined, undefined, numberStringifiers)).toEqual(
    '1.23456789123456789123456789e+26'
  )

  const values = [
    new Decimal('1.23456789123456789123456789e+26'),
    new Decimal('2.3'),
    new Decimal('123')
  ]

  expect(stringify(values, undefined, undefined, numberStringifiers)).toEqual(
    '[1.23456789123456789123456789e+26,2.3,123]'
  )
})

test('should not have a .toJSON method implemented', function () {
  expect('toJSON' in lln('123')).toBe(false)
})

test('should throw an error when the output of a number stringifier is not a number', function () {
  const wrongStringifier = {
    test: (value: string) => typeof value === 'number',
    stringify: (value: string) => 'oopsie' + value // <-- does not return a valid number
  }

  expect(() => stringify([4], undefined, undefined, [wrongStringifier])).toThrow(
    'Invalid JSON number: output of a number stringifier must be a string containing a JSON number (output: oopsie4)'
  )
})

test('stringify should keep formatting of a lossless number', function () {
  expect(stringify([lln('4.0')])).toEqual('[4.0]')
})

test('stringify with replacer function', function () {
  const json: GenericObject<unknown> = { a: 123, b: 'str', c: null, d: false, e: [1, 2, 3] }

  interface Log {
    context: JSONValue
    key: string
    value: JSONValue
  }

  const expected: Log[] = [
    {
      context: { '': { a: 123, b: 'str', c: null, d: false, e: [1, 2, 3] } },
      key: '',
      value: { a: 123, b: 'str', c: null, d: false, e: [1, 2, 3] }
    },
    {
      context: { a: 123, b: 'str', c: null, d: false, e: [1, 2, 3] },
      key: 'a',
      value: 123
    },
    {
      context: { a: 123, b: 'str', c: null, d: false, e: [1, 2, 3] },
      key: 'b',
      value: 'str'
    },
    {
      context: { a: 123, b: 'str', c: null, d: false, e: [1, 2, 3] },
      key: 'c',
      value: null
    },
    {
      context: { a: 123, b: 'str', c: null, d: false, e: [1, 2, 3] },
      key: 'd',
      value: false
    },
    {
      context: { a: 123, b: 'str', c: null, d: false, e: [1, 2, 3] },
      key: 'e',
      value: [1, 2, 3]
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
      context: [1, 2, 3],
      key: '2',
      value: 3
    }
  ]

  const logs: Log[] = []
  stringify(json, function (key, value) {
    logs.push({ context: this, key, value: value as JSONValue })
    return value as JSONValue
  })
  expect(logs).toEqual(expected)

  // validate expected outcome against native JSON.stringify
  const logs2: Log[] = []
  JSON.stringify(json, function (key, value) {
    logs2.push({ context: this, key, value })
    return value
  })
  expect(logs2).toEqual(expected)
})

test('stringify with replacer function (2)', function () {
  const json = { a: 123, b: 'str', c: 'ignoreMe' }

  const expected = '{"a":"number:a:123","b":"string:b:str"}'

  function replacer(key: string, value: unknown): JSONValue {
    if (key === 'c') {
      return undefined
    }

    if (typeof value === 'number') {
      return 'number:' + key + ':' + value
    }
    if (typeof value === 'string') {
      return 'string:' + key + ':' + value
    }

    return value as JSONValue
  }

  expect(stringify(json, replacer)).toEqual(expected)

  // validate expected outcome against native JSON.stringify
  expect(JSON.stringify(json, replacer)).toEqual(expected)
})

test('stringify with replacer Array', function () {
  const json = { a: 1, c: { a: 1, b: 2, c: 3, d: 4 }, b: [1, 2, 3], d: 4, 42: 'universe' }
  const replacer = ['a', 'b', 'c', 42]

  // validate expected outcome against native JSON.stringify
  const expected = '{"a":1,"b":[1,2,3],"c":{"a":1,"b":2,"c":3},"42":"universe"}'
  expect(JSON.stringify(json, replacer)).toEqual(expected)

  expect(stringify(json, replacer)).toEqual(expected)
})

test('stringify with numeric space', function () {
  const json: JSONValue = { a: 1, b: [1, 2, null, undefined, { c: 3 }], d: null }

  const expected =
    '{\n' +
    '  "a": 1,\n' +
    '  "b": [\n' +
    '    1,\n' +
    '    2,\n' +
    '    null,\n' +
    '    null,\n' +
    '    {\n' +
    '      "c": 3\n' +
    '    }\n' +
    '  ],\n' +
    '  "d": null\n' +
    '}'

  expect(stringify(json, null, 2)).toEqual(expected)

  // validate expected outcome against native JSON.stringify
  expect(JSON.stringify(json, null, 2)).toEqual(expected)
})

test('stringify with string space', function () {
  const json: JSONValue = { a: 1, b: [1, 2, null, undefined, { c: 3 }], d: null }

  const expected =
    '{\n' +
    '~"a": 1,\n' +
    '~"b": [\n' +
    '~~1,\n' +
    '~~2,\n' +
    '~~null,\n' +
    '~~null,\n' +
    '~~{\n' +
    '~~~"c": 3\n' +
    '~~}\n' +
    '~],\n' +
    '~"d": null\n' +
    '}'

  expect(stringify(json, null, '~')).toEqual(expected)

  // validate expected outcome against native JSON.stringify
  expect(JSON.stringify(json, null, '~')).toEqual(expected)
})

test('stringify an empty array', function () {
  expect(stringify([], null, 2)).toEqual('[]')
  expect(stringify([], null, '    ')).toEqual('[]')
})

test('stringify an empty object', function () {
  expect(stringify({}, null, 2)).toEqual('{}')
  expect(stringify({}, null, '    ')).toEqual('{}')
})
