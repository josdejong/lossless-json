'use strict';

import test from 'ava';
import 'babel-core/register';

import { LosslessNumber } from '../lib/LosslessNumber';
import { stringify } from '../lib/stringify';

// helper function to create a lossless number
function lln (value) {
  return new LosslessNumber(value);
}

test('stringify', function (t) {
  t.same(stringify(undefined), undefined, 'should not stringify undefined');

  t.same(stringify(null), 'null', 'should stringify null');

  t.same(stringify(true), 'true', 'should stringify boolean');
  t.same(stringify(false), 'false', 'should stringify boolean');
  t.same(stringify(new Boolean(true)), 'true', 'should stringify Boolean');
  t.same(stringify(new Boolean(false)), 'false', 'should stringify Boolean');

  t.same(stringify(2.3), '2.3', 'should stringify number');
  t.same(stringify(new Number(2.3)), '2.3', 'should stringify Number');
  t.same(stringify(-2.3), '-2.3', 'should stringify number');
  t.same(stringify(Infinity), 'null', 'should stringify Infinity');
  t.same(stringify(NaN), 'null', 'should stringify NaN');

  t.same(stringify('str'), '"str"', 'should stringify string');
  t.same(stringify(new String('str')), '"str"', 'should stringify String');
  t.same(stringify('\"'), '"\\""', 'should stringify a string with control characters');
  t.same(stringify('\\'), '"\\\\"', 'should stringify a string with control characters');
  t.same(stringify('\b'), '"\\b"', 'should stringify a string with control characters');
  t.same(stringify('\f'), '"\\f"', 'should stringify a string with control characters');
  t.same(stringify('\n'), '"\\n"', 'should stringify a string with control characters');
  t.same(stringify('\r'), '"\\r"', 'should stringify a string with control characters');
  t.same(stringify('\t'), '"\\t"', 'should stringify a string with control characters');
  t.same(stringify('\"\\/\b\f\n\r\t'), '"\\"\\\\/\\b\\f\\n\\r\\t"', 'should stringify a string with control characters');

  // validate expected outcome against native JSON.stringify
  t.same(JSON.stringify('\"\\/\b\f\n\r\t'), '"\\"\\\\/\\b\\f\\n\\r\\t"', 'should stringify a string with control characters');

  t.same(stringify(new Date('2016-02-08T14:00:00Z')), '"2016-02-08T14:00:00.000Z"', 'should stringify a Date');

  t.same(stringify([2,"str",null, undefined, true, function () {}]),
      '[2,"str",null,null,true,null]', 'should stringify Array');

  t.same(stringify({a:2,b:"str",c:null,d: undefined, e:function() {}}),
      '{"a":2,"b":"str","c":null}', 'should stringify Object');

  t.same(stringify({a:2,toJSON: function () {return 'foo'}}),
      '"foo"', 'should stringify object with toJSON method');

  // TODO: Symbol
  // TODO: ignore non-enumerable properties
});

test('stringify a full JSON object', function (t) {
  let expected = '{"a":123,"b":"str","c":null,"d":false,"e":[1,2,3]}';
  let json = {a: lln(123), b:'str', c: null, d: false, e:[1, 2, 3]};

  let stringified = stringify(json);

  t.same(stringified, expected, 'should stringify a JSON object correctly');
});


test('stringify with replacer function', function (t) {
  let json = {"a":123,"b":"str","c":null,"d":false,"e":[1,2,3]};

  let expected = [
    {key: '', value: { a: 123, b: 'str', c: null, d: false, e: [1, 2, 3] }},
    {key: 'a', value: 123},
    {key: 'b', value: 'str'},
    {key: 'c', value: null},
    {key: 'd', value: false},
    {key: 'e', value: [1,2,3]},
    {key: '0', value: 1},
    {key: '1', value: 2},
    {key: '2', value: 3}
  ];

  let logs = [];
  stringify(json, function (key, value) {
    logs.push({key, value});
    return value;
  });
  t.same(logs, expected);

  // validate expected outcome against native JSON.stringify
  let logs2 = [];
  JSON.stringify(json, function (key, value) {
    logs2.push({key, value});
    return value;
  });
  t.same(logs2, expected);

});

test('stringify with replacer function (2)', function (t) {
  let text = {"a":123,"b":"str"};

  let expected = '{"a":"number:a:123","b":"string:b:str"}';

  function replacer (key, value) {
    if (typeof value === 'number') {
      return 'number:' + key + ':' + value;
    }
    if (typeof value === 'string') {
      return 'string:' + key + ':' + value;
    }

    return value;
  }

  t.same(stringify(text, replacer), expected);

  // validate expected outcome with native JSON.parse
  t.same(JSON.stringify(text, replacer), expected);
});

test('stringify with replacer Array', function (t) {
  // TODO
});

test('stringify with numeric space', function (t) {
  // TODO
});

test('stringify with string space', function (t) {
  // TODO
});
