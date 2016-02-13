import test from 'ava';
import 'babel-core/register';

import { parse, stringify } from '../lib/pointer';

test('stringify a JSON pointer', function (t) {
  t.same(stringify([]), '#/');
  t.same(stringify(['foo','bar']), '#/foo/bar');
  t.same(stringify(['foo bar','baz']), '#/foo%20bar/baz');
});


test('parse a JSON pointer', function (t) {
  t.same(parse('#/'), []);
  t.same(parse('#/foo/bar'), ['foo','bar']);
  t.same(parse('#/foo%20bar/baz'), ['foo bar','baz']);
});


test('throw an exception if not starting with #', function (t) {
  t.throws(() => parse('/foo/bar'), /Cannot parse JSON Pointer/);
});
