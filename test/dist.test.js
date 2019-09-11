import test from 'ava';

import * as LosslessJson from '../dist/lossless-json';

// note that the following test will fail if the library isn't build beforehand
test('Test bundle in dist', function (t) {
  t.deepEqual(
    LosslessJson.parse('{"a":2}'),
    {a: new LosslessJson.LosslessNumber(2)},
    'parse json');

  t.is(
    LosslessJson.stringify({a:2}),
    '{"a":2}',
    'stringify json');

  t.deepEqual(LosslessJson.config(), {circularRefs: true}, 'get config');

  t.truthy(new LosslessJson.LosslessNumber(2).isLosslessNumber, 'create lossless number');
});
