'use strict';

import test from 'ava';
import 'babel-core/register';

import { parse, stringify, config, LosslessNumber } from '../lib/index';

test('Public API', function (t) {
  t.same(parse('{}'), {}, 'parse json');
  t.same(stringify({}), '{}', 'stringify json');
  t.same(config(), {circularRefs: true}, 'get config');
  t.ok(new LosslessNumber(2).isLosslessNumber, 'create lossless number');
});

test('set configuration', function (t) {
  let json = {};
  json.a = {b: json};

  let expected = '{"a":{"b":{"$ref":"#/"}}}';
  let text = stringify(json);
  t.same(text, expected);

  // disable circular references
  let c = config({circularRefs: false});
  t.same(c, {circularRefs: false});
  t.throws(() => stringify(json), /Circular reference at "#\/a\/b"/);
  t.same (parse(expected), {a: {b: {$ref:'#/'}}});

  // enable circular references again
  config({circularRefs: true});
  let text2 = stringify(json);
  t.same(text2, expected);
});
