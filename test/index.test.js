import test from 'ava';

import { parse, stringify, config, LosslessNumber } from '../lib/index';

test('Public API', function (t) {
  t.deepEqual(parse('{}'), {}, 'parse json');
  t.is(stringify({}), '{}', 'stringify json');
  t.deepEqual(config(), {circularRefs: true}, 'get config');
  t.truthy(new LosslessNumber(2).isLosslessNumber, 'create lossless number');
});

test('set configuration', function (t) {
  let json = {};
  json.a = {b: json};

  let expected = '{"a":{"b":{"$ref":"#/"}}}';
  let text = stringify(json);
  t.is(text, expected);

  // disable circular references
  let c = config({circularRefs: false});
  t.deepEqual(c, {circularRefs: false});
  t.throws(() => stringify(json), { message: 'Circular reference at "#\/a\/b"' });
  t.deepEqual (parse(expected), {a: {b: {$ref:'#/'}}});

  // enable circular references again
  config({circularRefs: true});
  let text2 = stringify(json);
  t.is(text2, expected);
});
