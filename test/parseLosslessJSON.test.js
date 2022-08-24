import { LosslessNumber } from '../src/LosslessNumber'
import { parseLosslessJSON } from '../src/parseLosslessJSON.js'
import { stringifyLosslessJSON } from '../src/stringifyLosslessJSON.js'

// helper function to create a lossless number
function lln (value) {
  return new LosslessNumber(value);
}

// deepEqual objects compared as plain JSON instead of JavaScript classes
function expectDeepEqual(a, b) {
  expect(jsonify(a)).toEqual(jsonify(b));
}

// turn a JavaScript object into plain JSON
function jsonify (obj) {
  return JSON.parse(JSON.stringify(obj));
}

test('full JSON object', function () {
  let text = '{"a":2.3e100,"b":"str","c":null,"d":false,"e":[1,2,3]}';
  let expected = {a: lln('2.3e100'), b:'str', c: null, d: false, e:[lln(1), lln(2), lln(3)]};
  let parsed = parseLosslessJSON(text);

  expect(jsonify(parsed)).toEqual(jsonify(expected));
});

test('object', function () {
  expect(parseLosslessJSON('{}')).toEqual({});
  expect(parseLosslessJSON('  { \n } \t ')).toEqual({});
  expect(parseLosslessJSON('{"a": {}}')).toEqual({a: {}});
  expect(parseLosslessJSON('{"a": "b"}')).toEqual({a: 'b'});
  expect(parseLosslessJSON('{"a": 2}')).toEqual({a: lln(2)});
});

test('array', function () {
  expect(parseLosslessJSON('[]')).toEqual([]);
  expect(parseLosslessJSON('[{}]')).toEqual([{}]);
  expect(parseLosslessJSON('{"a":[]}')).toEqual({a:[]});
  expect(parseLosslessJSON('[1, "hi", true, false, null, {}, []]')).toEqual([lln(1), "hi", true, false, null, {}, []]);
});

test('number', function () {
  expect(parseLosslessJSON('2.3e500').isLosslessNumber).toBe(true);
  expect(parseLosslessJSON('123456789012345678901234567890').isLosslessNumber).toBe(true);
  expect(parseLosslessJSON('23')).toEqual(lln('23'));
  expect(parseLosslessJSON('0')).toEqual(lln('0'));
  expect(parseLosslessJSON('0e+2')).toEqual(lln('0e+2'));
  expect(parseLosslessJSON('0e+2').valueOf()).toEqual(0);
  expect(parseLosslessJSON('0.0')).toEqual(lln('0.0'));
  expect(parseLosslessJSON('-0')).toEqual(lln('-0'));
  expect(parseLosslessJSON('2.3')).toEqual(lln(2.3));
  expect(parseLosslessJSON('2300e3')).toEqual(lln('2300e3'));
  expect(parseLosslessJSON('2300e+3')).toEqual(lln('2300e+3'));
  expect(parseLosslessJSON('-2')).toEqual(lln('-2'));
  expect(parseLosslessJSON('2e-3')).toEqual(lln('2e-3'));
  expect(parseLosslessJSON('2.3e-3')).toEqual(lln('2.3e-3'));
});

test('LosslessNumber', function () {
  let str = '22222222222222222222';
  expectDeepEqual(parseLosslessJSON(str), lln(str));

  let str2 = '2.3e+500';
  expectDeepEqual(parseLosslessJSON(str2), lln(str2));

  let str3 = '2.3e-500';
  expectDeepEqual(parseLosslessJSON(str3), lln(str3));
});

test('string', function () {
  expect(parseLosslessJSON('"str"')).toEqual('str');
  expect(JSON.parse('"\\"\\\\\\/\\b\\f\\n\\r\\t"')).toEqual('"\\/\b\f\n\r\t');
  expect(parseLosslessJSON('"\\"\\\\\\/\\b\\f\\n\\r\\t"')).toEqual('"\\/\b\f\n\r\t');
  expect(JSON.parse('"\\u260E"')).toEqual('\u260E');
  expect(parseLosslessJSON('"\\u260E"')).toEqual('\u260E');
});

test('keywords', function () {
  expect(parseLosslessJSON('true')).toEqual(true);
  expect(parseLosslessJSON('false')).toEqual(false);
  expect(parseLosslessJSON('null')).toEqual(null);
});

test('reviver - replace values', function () {
  let text = '{"a":123,"b":"str"}';

  let expected = {
    type: 'object',
    value: {
      a: {type: 'object', value: lln(123)},
      b: {type: 'string', value: 'str'}
    }
  };

  function reviver (key, value) {
    return {
      type: typeof value,
      value
    };
  }

  expect(parseLosslessJSON(text, reviver)).toEqual(expected);
});

test('reviver - invoke callbacks with key/value and correct context', function () {
  let text = '{"a":123,"b":"str","c":null,"22":22,"d":false,"e":[1,2,3]}';

  let expected = [
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
      value: [1,null,3]
    },
    {
      context: {'': { 22: 22, a: 123, b: 'str', c: null, e: [1, null, 3] }},
      key: '',
      value: { 22: 22, a: 123, b: 'str', c: null, e: [1, null, 3] }
    }
  ];

  // convert LosslessNumbers to numbers for easy comparison with native JSON
  function toRegularJSON(json) {
    return JSON.parse(stringifyLosslessJSON(json))
  }

  function reviver(key, value) {
    return key === 'd'
      ? undefined
      : key === '1'
        ? null
        : value
  }

  // validate expected outcome against reference implemenation JSON.parse
  let logsReference = [];
  JSON.parse(text, function (key, value) {
    logsReference.push({context:
        toRegularJSON(this),
      key,
      value
    });
    return reviver(key, value)
  });

  let logsActual = [];
  parseLosslessJSON(text, function (key, value) {
    logsActual.push({
      context: toRegularJSON(this),
      key,
      value: toRegularJSON(value)
    });
    return reviver(key, value)
  });

  expect(logsReference).toEqual(expected);
  expect(logsActual).toEqual(expected);
});

test('correctly handle strings equaling a JSON delimiter', function () {
  expect(parseLosslessJSON('""')).toEqual("");
  expect(parseLosslessJSON('"["')).toEqual("[");
  expect(parseLosslessJSON('"]"')).toEqual("]");
  expect(parseLosslessJSON('"{"')).toEqual("{");
  expect(parseLosslessJSON('"}"')).toEqual("}");
  expect(parseLosslessJSON('":"')).toEqual(":");
  expect(parseLosslessJSON('","')).toEqual(",");
});

test('reviver - revive a lossless number correctly', function () {
  let text = '2.3e+500';
  let expected = [
    {key: '', value: lln('2.3e+500')}
  ];
  let logs = [];

  parseLosslessJSON(text, function (key, value) {
    logs.push({key, value});
    return value;
  });
  expectDeepEqual(logs, expected);
});

test('parse circular reference (1)', function () {
  let text = '{"a":{"b":{"$ref":"#/"}}}';
  let json = parseLosslessJSON(text);

  expect(json.a.b).toBe(json);
});

test('parse circular reference (2)', function () {
  let text = '{"a":{"b":{"b":{"$ref":"#/a/b"}}}}';
  let json  = parseLosslessJSON(text);

  expect(json.a.b.b).toBe(json.a.b);
});

test('parse circular reference (3)', function () {
  let text = '{"a":[{},{"b":{"a":{"$ref":"#/a"}}}]}';
  let json = parseLosslessJSON(text);

  expect(json.a[1].b.a).toBe(json.a);
});

test('throw exceptions', function () {
  expect(function () {parseLosslessJSON('')}).toThrow(/Unexpected end of json string/);

  expect(function () {parseLosslessJSON('{')}).toThrow(/Object key expected/);
  expect(function () {parseLosslessJSON('{"a",')}).toThrow(/Colon expected/);
  expect(function () {parseLosslessJSON('{a:2}')}).toThrow(/Object key expected/);
  expect(function () {parseLosslessJSON('{"a":2,}')}).toThrow(/Object key expected/);
  expect(function () {parseLosslessJSON('{"a" "b"}')}).toThrow(/Colon expected/);
  expect(function () {parseLosslessJSON('{}{}')}).toThrow(/Unexpected characters/);

  expect(function () {parseLosslessJSON('[')}).toThrow(/Unexpected end of json string/);
  expect(function () {parseLosslessJSON('[2,')}).toThrow(/Unexpected end of json string/);
  expect(function () {parseLosslessJSON('[2,]')}).toThrow(/Value expected/);

  expect(function () {parseLosslessJSON('2.3.4')}).toThrow(/Syntax error in part ".4" \(char 3\)/);
  expect(function () {parseLosslessJSON('2..3')}).toThrow(/Invalid number, digit expected \(char 2\)/);
  expect(function () {parseLosslessJSON('2e3.4')}).toThrow(/Syntax error in part ".4" \(char 3\)/);
  expect(function () {parseLosslessJSON('2e')}).toThrow(/Invalid number, digit expected \(char 2\)/);
  expect(function () {parseLosslessJSON('-')}).toThrow(/Invalid number, digit expected \(char 1\)/);

  expect(function () {parseLosslessJSON('"a')}).toThrow(/End of string expected/);
  expect(function () {parseLosslessJSON('foo')}).toThrow(/Unknown symbol "foo"/);
  expect(function () {parseLosslessJSON('"\\a"')}).toThrow(/Invalid escape character "\\a" /);
  expect(function () {parseLosslessJSON('"\\u26"')}).toThrow(/Invalid unicode character/);
  expect(function () {parseLosslessJSON('"\\uZ000"')}).toThrow(/Invalid unicode character/);
});
