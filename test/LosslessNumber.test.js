import { LosslessNumber } from '../src/LosslessNumber';

test('create a LosslessNumber from string', function() {
  let n = new LosslessNumber('42');
  expect(n.isLosslessNumber).toBe(true);
  expect(n.value).toBe('42');
});

test('throw an error when when creating a LosslessNumber from invalid string', function() {
  // invalid
  expect(() => new LosslessNumber('a')).toThrow(/Invalid number/);
  expect(() => new LosslessNumber('22.')).toThrow(/Invalid number/);
  expect(() => new LosslessNumber('0.2e')).toThrow(/Invalid number/);
  expect(() => new LosslessNumber('2e3.4')).toThrow(/Invalid number/);
  expect(() => new LosslessNumber('2.3.4')).toThrow(/Invalid number/);
  expect(() => new LosslessNumber('+24')).toThrow(/Invalid number/);

  // valid
  new LosslessNumber('42e+4');
  new LosslessNumber('42E-4');
  new LosslessNumber('-42E-4');
});

test('create a LosslessNumber from number', function() {
  let n = new LosslessNumber(42);
  expect(n.isLosslessNumber).toBe(true);
  expect(n.value).toEqual('42');
});

test('create a LosslessNumber from some object', function() {
  let n = new LosslessNumber(new Date('2016-02-12T00:00:00.000Z'));
  expect(n.toString()).toBe('1455235200000');

  let someObj = {
    valueOf: () => '2.3e-500'
  };
  let n2 = new LosslessNumber(someObj);
  expect(n2.toString()).toBe('2.3e-500');
});

test('throw an error when creating a LosslessNumber from invalid number', function() {
  expect(() => new LosslessNumber(Math.PI)).toThrow(/Invalid number: contains more than 15 digits/);
  expect(() => new LosslessNumber(Infinity)).toThrow(/Invalid number: Infinity/);
  expect(() => new LosslessNumber(NaN)).toThrow(/Invalid number: NaN/);
});

test('get valueOf a LosslessNumber', function() {
  expect(new LosslessNumber('23.4').valueOf()).toBe(23.4);
  expect(new LosslessNumber('23e4').valueOf()).toBe(230000);

  expect(() => new LosslessNumber('123456789012345678901234').valueOf())
    .toThrow(/Cannot convert to number: number would be truncated/);
  expect(() => new LosslessNumber('2.3e+500').valueOf())
    .toThrow(/Cannot convert to number: number would overflow/);
  expect(() => new LosslessNumber('2.3e-500').valueOf())
    .toThrow(/Cannot convert to number: number would underflow/);
});

test('can do operations like add a number and a LosslessNumber', () => {
  expect(new LosslessNumber('3') + 2).toBe(5)
})

test('LosslessNumber - toString', function() {
  expect(new LosslessNumber('23.4').toString()).toBe('23.4');
});
