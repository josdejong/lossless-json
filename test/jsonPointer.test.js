import { parseJSONPointer, stringifyJSONPointer } from '../src/jsonPointer.js';

test('stringify a JSON pointer', function () {
  expect(stringifyJSONPointer([])).toBe('#/');
  expect(stringifyJSONPointer(['foo','bar'])).toBe('#/foo/bar');
  expect(stringifyJSONPointer(['foo bar','baz'])).toBe('#/foo bar/baz');
});

test('parse a JSON pointer', function () {
  expect(parseJSONPointer('#/')).toEqual([]);
  expect(parseJSONPointer('#/foo/bar')).toEqual(['foo','bar']);
  expect(parseJSONPointer('#/foo bar/baz')).toEqual(['foo bar','baz']);
});

test('throw an exception if not starting with #', function () {
  expect(() => parseJSONPointer('/foo/bar')).toThrow(/Cannot parse JSON Pointer/);
});
