import { parseLosslessJSON, stringifyLosslessJSON, config, LosslessNumber } from '../src/index';

test('Public API', function () {
  expect(parseLosslessJSON('{}')).toEqual({});
  expect(stringifyLosslessJSON({})).toEqual('{}');
  expect(config()).toEqual({circularRefs: true});
  expect(new LosslessNumber(2).isLosslessNumber).toBe(true);
});

test('set configuration', function () {
  let json = {};
  json.a = {b: json};

  let expected = '{"a":{"b":{"$ref":"#/"}}}';
  let text = stringifyLosslessJSON(json);
  expect(text).toEqual(expected);

  // disable circular references
  let c = config({circularRefs: false});
  expect(c).toEqual({circularRefs: false});
  expect(() => stringifyLosslessJSON(json)).toThrow('Circular reference at "#\/a\/b"');
  expect(parseLosslessJSON(expected)).toEqual({a: {b: {$ref:'#/'}}});

  // enable circular references again
  config({circularRefs: true});
  let text2 = stringifyLosslessJSON(json);
  expect(text2).toEqual(expected);
});
