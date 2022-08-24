import { parse, stringify } from '../src/pointer';

test('stringify a JSON pointer', function () {
  expect(stringify([])).toBe('#/');
  expect(stringify(['foo','bar'])).toBe('#/foo/bar');
  expect(stringify(['foo bar','baz'])).toBe('#/foo%20bar/baz');
});

test('parse a JSON pointer', function () {
  expect(parse('#/')).toEqual([]);
  expect(parse('#/foo/bar')).toEqual(['foo','bar']);
  expect(parse('#/foo%20bar/baz')).toEqual(['foo bar','baz']);
});

test('throw an exception if not starting with #', function () {
  expect(() => parse('/foo/bar')).toThrow(/Cannot parse JSON Pointer/);
});
