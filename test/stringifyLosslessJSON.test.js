import { LosslessNumber } from '../src/LosslessNumber';
import { stringifyLosslessJSON } from '../src/stringifyLosslessJSON.js';

// helper function to create a lossless number
function lln (value) {
  return new LosslessNumber(value);
}

test('stringify', function () {
  expect(stringifyLosslessJSON(undefined)).toEqual(undefined);

  expect(stringifyLosslessJSON(null)).toEqual('null');

  expect(stringifyLosslessJSON(true)).toEqual('true');
  expect(stringifyLosslessJSON(false)).toEqual('false');
  expect(stringifyLosslessJSON(new Boolean(true))).toEqual('true');
  expect(stringifyLosslessJSON(new Boolean(false))).toEqual('false');

  expect(stringifyLosslessJSON(2.3)).toEqual('2.3');
  expect(stringifyLosslessJSON(new Number(2.3))).toEqual('2.3');
  expect(stringifyLosslessJSON(-2.3)).toEqual('-2.3');
  expect(stringifyLosslessJSON(Infinity)).toEqual('null');
  expect(stringifyLosslessJSON(NaN)).toEqual('null');

  expect(stringifyLosslessJSON('str')).toEqual('"str"');
  expect(stringifyLosslessJSON(new String('str'))).toEqual('"str"');
  expect(stringifyLosslessJSON('\"')).toEqual('"\\""');
  expect(stringifyLosslessJSON('\\')).toEqual('"\\\\"');
  expect(stringifyLosslessJSON('\b')).toEqual('"\\b"');
  expect(stringifyLosslessJSON('\f')).toEqual('"\\f"');
  expect(stringifyLosslessJSON('\n')).toEqual('"\\n"');
  expect(stringifyLosslessJSON('\r')).toEqual('"\\r"');
  expect(stringifyLosslessJSON('\t')).toEqual('"\\t"');
  expect(stringifyLosslessJSON('\"\\/\b\f\n\r\t')).toEqual('"\\"\\\\/\\b\\f\\n\\r\\t"');

  // validate expected outcome against native JSON.stringify
  expect(JSON.stringify('\"\\/\b\f\n\r\t')).toEqual('"\\"\\\\/\\b\\f\\n\\r\\t"');

  expect(stringifyLosslessJSON(new Date('2016-02-08T14:00:00Z'))).toEqual('"2016-02-08T14:00:00.000Z"');

  expect(stringifyLosslessJSON([2,"str",null, undefined, true, function () {}]))
    .toEqual('[2,"str",null,null,true,null]');

  expect(stringifyLosslessJSON({a:2,b:"str",c:null,d: undefined, e:function() {}}))
    .toEqual('{"a":2,"b":"str","c":null}');

  expect(stringifyLosslessJSON({'\\\\d': 1}))
    .toEqual('{\"\\\\\\\\d\":1}');

  // validate exepected outcome against native JSON.stringify
  expect(JSON.stringify({'\\\\d': 1}))
    .toEqual('{\"\\\\\\\\d\":1}');

  expect(stringifyLosslessJSON({a:2,toJSON: function () {return 'foo'}}))
    .toEqual('"foo"');

  // TODO: Symbol
  // TODO: ignore non-enumerable properties
});

test('stringify a full JSON object', function () {
  let expected = '{"a":123,"b":"str","c":null,"d":false,"e":[1,2,3]}';
  let json = {a: lln(123), b:'str', c: null, d: false, e:[1, 2, 3]};

  let stringified = stringifyLosslessJSON(json);

  expect(stringified).toEqual(expected);
});


test('stringify with replacer function', function () {
  let json = {"a":123,"b":"str","c":null,"d":false,"e":[1,2,3]};

  let expected = [
    {
      context: {'': { a: 123, b: 'str', c: null, d: false, e: [1, 2, 3] }},
      key: '',
      value: { a: 123, b: 'str', c: null, d: false, e: [1, 2, 3] }},
    {
      context: {"a":123,"b":"str","c":null,"d":false,"e":[1,2,3]},
      key: 'a',
      value: 123
    },
    {
      context: {"a":123,"b":"str","c":null,"d":false,"e":[1,2,3]},
      key: 'b',
      value: 'str'
    },
    {
      context: {"a":123,"b":"str","c":null,"d":false,"e":[1,2,3]},
      key: 'c',
      value: null
    },
    {
      context: {"a":123,"b":"str","c":null,"d":false,"e":[1,2,3]},
      key: 'd',
      value: false
    },
    {
      context: {"a":123,"b":"str","c":null,"d":false,"e":[1,2,3]},
      key: 'e',
      value: [1,2,3]
    },
    {
      context: [1,2,3],
      key: '0',
      value: 1
    },
    {
      context: [1,2,3],
      key: '1',
      value: 2
    },
    {
      context: [1,2,3],
      key: '2',
      value: 3
    }
  ];

  let logs = [];
  stringifyLosslessJSON(json, function (key, value) {
    logs.push({context: this, key, value});
    return value;
  });
  expect(logs).toEqual(expected);

  // validate expected outcome against native JSON.stringify
  let logs2 = [];
  JSON.stringify(json, function (key, value) {
    logs2.push({context: this, key, value});
    return value;
  });
  expect(logs2).toEqual(expected);
});

test('stringify with replacer function (2)', function () {
  let json = {"a":123,"b":"str","c":"ignoreMe"};

  let expected = '{"a":"number:a:123","b":"string:b:str"}';

  function replacer (key, value) {
    if (key === 'c') {
      return undefined;
    }

    if (typeof value === 'number') {
      return 'number:' + key + ':' + value;
    }
    if (typeof value === 'string') {
      return 'string:' + key + ':' + value;
    }

    return value;
  }

  expect(stringifyLosslessJSON(json, replacer)).toEqual(expected);

  // validate expected outcome against native JSON.stringify
  expect(JSON.stringify(json, replacer)).toEqual(expected);
});

test('stringify with replacer Array', function () {
  let json = {a:1,c:{a:1,b:2,c:3,d:4},b:[1,2,3],d:4, '42': 'universe'};
  let replacer = ['a', 'b', 'c', 42];

  let expected = '{"42":"universe","a":1,"c":{"a":1,"b":2,"c":3},"b":[1,2,3]}';
  expect(stringifyLosslessJSON(json, replacer)).toEqual(expected);

  // validate expected outcome against native JSON.stringify
  // note: stringified order differs. can happen.
  let expected2 = '{"a":1,"b":[1,2,3],"c":{"a":1,"b":2,"c":3},"42":"universe"}';
  expect(JSON.stringify(json, replacer)).toEqual(expected2);
});

test('stringify with numeric space', function () {
  let json = {a: 1, b: [1,2,null,undefined,{c:3}], d: null};

  let expected =
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
      '}';

  expect(stringifyLosslessJSON(json, null, 2)).toEqual(expected);

  // validate expected outcome against native JSON.stringify
  expect(JSON.stringify(json, null, 2)).toEqual(expected);
});

test('stringify with string space', function () {
  let json = {a: 1, b: [1,2,null,undefined,{c:3}], d: null};

  let expected =
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
      '}';

  expect(stringifyLosslessJSON(json, null, '~')).toEqual(expected);

  // validate expected outcome against native JSON.stringify
  expect(JSON.stringify(json, null, '~')).toEqual(expected);
});

test('stringify circular reference (1)', function () {
  let json = {};
  json.a = {b: json};
  let expected = '{"a":{"b":{"$ref":"#/"}}}';
  let text = stringifyLosslessJSON(json);

  expect(text).toEqual(expected);
});

test('stringify circular reference (2)', function () {
  let obj = {a: {b: {}}};
  obj.a.b.b = obj.a.b;
  let expected = '{"a":{"b":{"b":{"$ref":"#/a/b"}}}}';
  let text = stringifyLosslessJSON(obj);

  expect(text).toEqual(expected);
});

test('stringify circular reference (3)', function () {
  let obj = {a: [{}, {b: {}}]};
  obj.a[1].b.a = obj.a;

  let expected = '{"a":[{},{"b":{"a":{"$ref":"#/a"}}}]}';
  let text = stringifyLosslessJSON(obj);

  expect(text).toEqual(expected);
});
