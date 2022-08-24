import * as LosslessJson from '../dist/lossless-json';

// note that the following test will fail if the library isn't build beforehand
test('Test bundle in dist', function () {
  expect(LosslessJson.parse('{"a":2}'))
    .toEqual({a: new LosslessJson.LosslessNumber(2)});

  expect(LosslessJson.stringify({a:2}))
    .toEqual('{"a":2}');

  expect(LosslessJson.config()).toEqual({circularRefs: true});

  expect(new LosslessJson.LosslessNumber(2).isLosslessNumber).toBe(true);
});
