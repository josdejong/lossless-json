'use strict';

import test from 'ava';
import 'babel-core/register';

import { LosslessNumber } from '../lib/LosslessNumber';
import { parse } from '../lib/parse';
import { stringify } from '../lib/stringify';

// helper function to create a lossless number
function lln (value) {
  return new LosslessNumber(value);
}

test('full JSON object', function (t) {
  let text = '{"a":2.3e500,"b":"str","c":null,"d":false,"e":[1,2,3]}';
  let expected = {a: lln('2.3e500'), b:'str', c: null, d: false, e:[lln(1), lln(2), lln(3)]};
  let parsed = parse(text);

  t.same(parsed, expected, 'should parse a JSON object correctly');
});

test('object', function (t) {
  t.same(parse('{}'), {}, 'should parse an empty object');
  t.same(parse('  { \n } \t '), {}, 'should parse an empty object with whitespaces');
  t.same(parse('{"a": {}}'), {a: {}}, 'should parse an object containing an object');
  t.same(parse('{"a": "b"}'), {a: 'b'}, 'should parse a non-empty object');
  t.same(parse('{"a": 2}'), {a: lln(2)}, 'should parse a non-empty object');
});

test('array', function (t) {
  t.same(parse('[]'), [], 'should parse an empty array');
  t.same(parse('[{}]'), [{}], 'should parse an array containing an object');
  t.same(parse('{"a":[]}'), {a:[]}, 'should parse an object containing an array');
  t.same(parse('[1, "hi", true, false, null, {}, []]'), [lln(1), "hi", true, false, null, {}, []], 'should parse a non-empty array');
});

test('number', function (t) {
  t.ok(parse('2.3e500').isLosslessNumber, 'should parse a large number into a LosslessNumber');
  t.ok(parse('123456789012345678901234567890').isLosslessNumber, 'should parse a large number into a LosslessNumber');
  t.same(parse('23'), lln('23'), 'should parse a number');
  t.same(parse('0'), lln('0'), 'should parse a number');
  t.same(parse('0e+2'), lln('0e+2'), 'should parse a number');
  t.same(parse('0e+2').valueOf(), 0, 'should parse a number');
  t.same(parse('0.0'), lln('0.0'), 'should parse a number');
  t.same(parse('-0'), lln('-0'), 'should parse a number');
  t.same(parse('2.3'), lln(2.3), 'should parse a number');
  t.same(parse('2300e3'), lln('2300e3'), 'should parse a number');
  t.same(parse('2300e+3'), lln('2300e+3'), 'should parse a number');
  t.same(parse('-2'), lln('-2'), 'should parse a negative number');
  t.same(parse('2e-3'), lln('2e-3'), 'should parse a number');
  t.same(parse('2.3e-3'), lln('2.3e-3'), 'should parse a number');
});

test('LosslessNumber', function (t) {
  let str = '22222222222222222222';
  t.same(parse(str), lln(str), 'should parse a LosslessNumber without information loss');

  let str2 = '2.3e+500';
  t.same(parse(str2), lln(str2), 'should parse a LosslessNumber without information loss');

  let str3 = '2.3e-500';
  t.same(parse(str3), lln(str3), 'should parse a LosslessNumber without information loss');
});

test('string', function (t) {
  t.same(parse('"str"'), 'str', 'should parse a string');
  t.same(parse('"\\"\\\\\\/\\b\\f\\n\\r\\t"'), '"\\/\b\f\n\r\t', 'should parse a string with escape characters');
  t.same(JSON.parse('"\\"\\\\\\/\\b\\f\\n\\r\\t"'), '"\\/\b\f\n\r\t', 'should parse a string with escape characters');
  t.same(parse('"\\u260E"'), '\u260E', 'should parse a string with unicode');
  t.same(JSON.parse('"\\u260E"'), '\u260E', 'should parse a string with unicode');
});

test('keywords', function (t) {
  t.is(parse('true'), true, 'should parse true');
  t.is(parse('false'), false, 'should parse false');
  t.is(parse('null'), null, 'should parse null');
});

test('reviver - replace values', function (t) {
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

  t.same(parse(text, reviver), expected);
});

test('reviver - invoke callbacks with key/value and correct context', function (t) {
  let text = '{"a":123,"b":"str","c":null,"d":false,"e":[1,2,3]}';

  let expected = [
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
    },
    {
      context: { a: 123, b: 'str', c: null, d: false, e: [1, 2, 3] },
      key: 'e',
      value: [1,2,3]
    },
    {
      context: {'': { a: 123, b: 'str', c: null, d: false, e: [1, 2, 3] }},
      key: '',
      value: { a: 123, b: 'str', c: null, d: false, e: [1, 2, 3] }
    }
  ];

  // convert LosslessNumbers to numbers for easy comparison with native JSON
  function toRegularJSON(json) {
    return JSON.parse(stringify(json))
  }

  let logs = [];
  parse(text, function (key, value) {
    logs.push({
      context: toRegularJSON(this),
      key,
      value: toRegularJSON(value)
    });
    return value;
  });
  t.same(logs, expected);

  // validate expected outcome against native JSON.parse
  let logs2 = [];
  JSON.parse(text, function (key, value) {
    logs2.push({context: JSON.parse(JSON.stringify(this)), key, value});
    return value;
  });
  t.same(logs2, expected);
});

test('reviver - revive a lossless number correctly', function (t) {
  let text = '2.3e+500';
  let expected = [
    {key: '', value: lln('2.3e+500')}
  ];
  let logs = [];

  parse(text, function (key, value) {
    logs.push({key, value});
    return value;
  });
  t.same(logs, expected);
});

test('throw exceptions', function (t) {
  t.throws(function () {parse('')}, /Unexpected end of json string/, 'should throw an exception when parsing an invalid number');

  t.throws(function () {parse('{')}, /Object key expected/, 'should throw an exception when parsing an invalid number');
  t.throws(function () {parse('{"a",')}, /Colon expected/, 'should throw an exception when parsing an invalid number');
  t.throws(function () {parse('{a:2}')}, /Object key expected/, 'should throw an exception when parsing an invalid number');
  t.throws(function () {parse('{"a":2,}')}, /Object key expected/, 'should throw an exception when parsing an invalid number');
  t.throws(function () {parse('{"a" "b"}')}, /Colon expected/, 'should throw an exception when parsing an invalid number');
  t.throws(function () {parse('{}{}')}, /Unexpected characters/, 'should throw an exception when parsing an invalid number');

  t.throws(function () {parse('[')}, /Unexpected end of json string/, 'should throw an exception when parsing an invalid number');
  t.throws(function () {parse('[2,')}, /Unexpected end of json string/, 'should throw an exception when parsing an invalid number');
  t.throws(function () {parse('[2,]')}, /Value expected/, 'should throw an exception when parsing an invalid number');

  t.throws(function () {parse('2.3.4')}, /Syntax error in part ".4" \(char 3\)/, 'should throw an exception when parsing an invalid number');
  t.throws(function () {parse('2..3')}, /Invalid number, digit expected \(char 2\)/, 'should throw an exception when parsing an invalid number');
  t.throws(function () {parse('2e3.4')}, /Syntax error in part ".4" \(char 3\)/, 'should throw an exception when parsing an invalid number');
  t.throws(function () {parse('2e')}, /Invalid number, digit expected \(char 2\)/, 'should throw an exception when parsing an invalid number');
  t.throws(function () {parse('-')}, /Invalid number, digit expected \(char 1\)/, 'should throw an exception when parsing an invalid number');

  t.throws(function () {parse('"a')}, /End of string expected/, 'should throw an exception when parsing an invalid number');
  t.throws(function () {parse('foo')}, /Unknown symbol "foo"/, 'should throw an exception when parsing an invalid number');
  t.throws(function () {parse('"\\a"')}, /Invalid escape character "\\a" /, 'should throw an exception when parsing an invalid number');
  t.throws(function () {parse('"\\u26"')}, /Invalid unicode character/, 'should throw an exception when parsing an invalid number');
  t.throws(function () {parse('"\\uZ000"')}, /Invalid unicode character/, 'should throw an exception when parsing an invalid number');
});
