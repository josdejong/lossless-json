import { LosslessNumber } from '../src/LosslessNumber';
import { stringify } from '../src/stringify.js';

// helper function to create a lossless number
function lln (value) {
  return new LosslessNumber(value);
}

test('stringify', function () {
  expect(stringify(undefined)).toEqual(undefined);

  expect(stringify(null)).toEqual('null');

  expect(stringify(true)).toEqual('true');
  expect(stringify(false)).toEqual('false');
  expect(stringify(new Boolean(true))).toEqual('true');
  expect(stringify(new Boolean(false))).toEqual('false');

  expect(stringify(2.3)).toEqual('2.3');
  expect(stringify(new Number(2.3))).toEqual('2.3');
  expect(stringify(-2.3)).toEqual('-2.3');
  expect(stringify(Infinity)).toEqual('null');
  expect(stringify(NaN)).toEqual('null');

  expect(stringify('str')).toEqual('"str"');
  expect(stringify(new String('str'))).toEqual('"str"');
  expect(stringify('\"')).toEqual('"\\""');
  expect(stringify('\\')).toEqual('"\\\\"');
  expect(stringify('\b')).toEqual('"\\b"');
  expect(stringify('\f')).toEqual('"\\f"');
  expect(stringify('\n')).toEqual('"\\n"');
  expect(stringify('\r')).toEqual('"\\r"');
  expect(stringify('\t')).toEqual('"\\t"');
  expect(stringify('\"\\/\b\f\n\r\t')).toEqual('"\\"\\\\/\\b\\f\\n\\r\\t"');

  // validate expected outcome against native JSON.stringify
  expect(JSON.stringify('\"\\/\b\f\n\r\t')).toEqual('"\\"\\\\/\\b\\f\\n\\r\\t"');

  expect(stringify(new Date('2016-02-08T14:00:00Z'))).toEqual('"2016-02-08T14:00:00.000Z"');

  expect(stringify([2,"str",null, undefined, true, function () {}]))
    .toEqual('[2,"str",null,null,true,null]');

  expect(stringify({a:2,b:"str",c:null,d: undefined, e:function() {}}))
    .toEqual('{"a":2,"b":"str","c":null}');

  expect(stringify({'\\\\d': 1}))
    .toEqual('{\"\\\\\\\\d\":1}');

  // validate exepected outcome against native JSON.stringify
  expect(JSON.stringify({'\\\\d': 1}))
    .toEqual('{\"\\\\\\\\d\":1}');

  expect(stringify({a:2,toJSON: function () {return 'foo'}}))
    .toEqual('"foo"');

  // TODO: Symbol
  // TODO: ignore non-enumerable properties
});

test('stringify a full JSON object', function () {
  let expected = '{"a":123,"b":"str","c":null,"d":false,"e":[1,2,3]}';
  let json = {a: lln(123), b:'str', c: null, d: false, e:[1, 2, 3]};

  let stringified = stringify(json);

  expect(stringified).toEqual(expected);
});

test('stringify bigint', function () {
  expect(stringify(123n)).toEqual('123')
  expect(stringify({ bigint: 123n })).toEqual('{"bigint":123}')
})

test('stringify should keep formatting of a lossless number', function () {
  expect(stringify([lln('4.0')])).toEqual('[4.0]')
})

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
  stringify(json, function (key, value) {
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

  expect(stringify(json, replacer)).toEqual(expected);

  // validate expected outcome against native JSON.stringify
  expect(JSON.stringify(json, replacer)).toEqual(expected);
});

test('stringify with replacer Array', function () {
  let json = {a:1,c:{a:1,b:2,c:3,d:4},b:[1,2,3],d:4, '42': 'universe'};
  let replacer = ['a', 'b', 'c', 42];

  // validate expected outcome against native JSON.stringify
  let expected = '{"a":1,"b":[1,2,3],"c":{"a":1,"b":2,"c":3},"42":"universe"}';
  expect(JSON.stringify(json, replacer)).toEqual(expected);

  expect(stringify(json, replacer)).toEqual(expected);

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

  expect(stringify(json, null, 2)).toEqual(expected);

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

  expect(stringify(json, null, '~')).toEqual(expected);

  // validate expected outcome against native JSON.stringify
  expect(JSON.stringify(json, null, '~')).toEqual(expected);
});
