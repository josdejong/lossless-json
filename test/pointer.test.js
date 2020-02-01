import test from 'ava';

import { parse, stringify } from '../lib/pointer';

test('stringify a JSON pointer', function (t) {
  t.is(stringify([]), '#/');
  t.is(stringify(['foo','bar']), '#/foo/bar');
  t.is(stringify(['foo bar','baz']), '#/foo%20bar/baz');
});


test('parse a JSON pointer', function (t) {
  t.deepEqual(parse('#/'), []);
  t.deepEqual(parse('#/foo/bar'), ['foo','bar']);
  t.deepEqual(parse('#/foo%20bar/baz'), ['foo bar','baz']);
});


test('throw an exception if not starting with #', function (t) {
  t.throws(() => parse('/foo/bar'), { message: /Cannot parse JSON Pointer/ });
});
