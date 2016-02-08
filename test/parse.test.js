'use strict';

import test from 'ava';
import 'babel-core/register';

import { LosslessNumber } from '../lib/LosslessNumber';
import { parse } from '../lib/parse';

// helper function to create a lossless number
function lln (value) {
  return new LosslessNumber(value);
}

test('parse - full JSON object', function (t) {

  let jsonStr = '{"a":123,"b":"str","c":null,"d":false,"e":[1,2,3]}';
  let expected = {a: lln(123), b:'str', c: null, d: false, e:[lln(1), lln(2), lln(3)]};
  let parsed = parse(jsonStr);
  t.same(parsed, expected, 'should parse a JSON object correctly');
});

test('parse - object', function (t) {
  t.same(parse('{}'), {}, 'should parse an empty object');
  t.same(parse('  { \n } \t '), {}, 'should parse an empty object with whitespaces');
  t.same(parse('{"a": {}}'), {a: {}}, 'should parse an object containing an object');
  t.same(parse('{"a": "b"}'), {a: 'b'}, 'should parse a non-empty object');
  t.same(parse('{"a": 2}'), {a: lln(2)}, 'should parse a non-empty object');
});

test('parse - array', function (t) {
  t.same(parse('[]'), [], 'should parse an empty array');
  t.same(parse('[{}]'), [{}], 'should parse an array containing an object');
  t.same(parse('{"a":[]}'), {a:[]}, 'should parse an object containing an array');
  t.same(parse('[1, "hi", true, false, null, {}, []]'), [lln(1), "hi", true, false, null, {}, []], 'should parse a non-empty array');
});

test('parse - number', function (t) {
  t.ok(parse('23').isLosslessNumber, 'should parse a number into a LosslessNumber');
  t.same(parse('23').valueOf(), 23, 'should parse a number');
  t.same(parse('0').valueOf(), 0, 'should parse a number');
  t.same(parse('2.3').valueOf(), 2.3, 'should parse a number');
  t.same(parse('2300e3').valueOf(), 2.3e+6, 'should parse a number');
  t.same(parse('2300e+3').valueOf(), 2.3e+6, 'should parse a number');
  t.same(parse('-2').valueOf(), -2, 'should parse a negative number');
  t.same(parse('2e-3').valueOf(), 0.002, 'should parse a number');
  t.same(parse('2.3e-3').valueOf(), 0.0023, 'should parse a number');
});

test('parse - LosslessNumber', function (t) {
  var str = '22222222222222222222';
  t.same(parse(str), lln(str), 'should parse a LosslessNumber without information loss');

  var str2 = '2.3e+500';
  t.same(parse(str2), lln(str2), 'should parse a LosslessNumber without information loss');

  var str3 = '2.3e-500';
  t.same(parse(str3), lln(str3), 'should parse a LosslessNumber without information loss');
});

test('parse - string', function (t) {
  t.same(parse('"str"'), 'str', 'should parse a string');
  t.same(parse('"\\"\\\\\\/\\b\\f\\n\\r\\t"'), '"\\/\b\f\n\r\t', 'should parse a string with escape characters');
  t.same(JSON.parse('"\\"\\\\\\/\\b\\f\\n\\r\\t"'), '"\\/\b\f\n\r\t', 'should parse a string with escape characters');
  t.same(parse('"\\u260E"'), '\u260E', 'should parse a string with unicode');
  t.same(JSON.parse('"\\u260E"'), '\u260E', 'should parse a string with unicode');
});

test('parse - keywords', function (t) {
  t.is(parse('true'), true, 'should parse true');
  t.is(parse('false'), false, 'should parse false');
  t.is(parse('null'), null, 'should parse null');
});

test('parse - reviver', function (t) {
  // TODO
});

test('parse - throw exceptions', function (t) {
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
