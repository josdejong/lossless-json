'use strict';

import test from 'ava';
import 'babel-core/register';

import { LosslessNumber } from '../lib/LosslessNumber';

test('create a LosslessNumber from string', function (t) {
  let n = new LosslessNumber('42');
  t.truthy(n.isLosslessNumber, 'should be a lossless number');
  t.is(n.value, '42', 'should contain the right value');

});

test('throw an error when when creating a LosslessNumber from invalid string', function (t) {
  // invalid
  t.throws(() => new LosslessNumber('a'), /Invalid number/);
  t.throws(() => new LosslessNumber('22.'), /Invalid number/);
  t.throws(() => new LosslessNumber('0.2e'), /Invalid number/);
  t.throws(() => new LosslessNumber('2e3.4'), /Invalid number/);
  t.throws(() => new LosslessNumber('2.3.4'), /Invalid number/);
  t.throws(() => new LosslessNumber('+24'), /Invalid number/);

  // valid
  new LosslessNumber('42e+4');
  new LosslessNumber('42E-4');
  new LosslessNumber('-42E-4');
});

test('create a LosslessNumber from number', function (t) {
  let n = new LosslessNumber(42);
  t.truthy(n.isLosslessNumber, 'should be a lossless number');
  t.is(n.value, '42', 'should contain the right value');
});

test('create a LosslessNumber from some object', function (t) {
  let n = new LosslessNumber(new Date('2016-02-12T00:00:00.000Z'));
  t.is(n.toString(), '1455235200000', 'should create from date');

  let someObj = {
    valueOf: () => '2.3e-500'
  };
  let n2 = new LosslessNumber(someObj);
  t.is(n2.toString(), '2.3e-500', 'should create via valueOf');
});

test('throw an error when creating a LosslessNumber from invalid number', function (t) {
  t.throws(() => new LosslessNumber(Math.PI), /Invalid number: contains more than 15 digits/);
  t.throws(() => new LosslessNumber(Infinity), /Invalid number: Infinity/);
  t.throws(() => new LosslessNumber(NaN), /Invalid number: NaN/);
});

test('get valueOf a LosslessNumber', function (t) {
  t.is(new LosslessNumber('23.4').valueOf(), 23.4);
  t.is(new LosslessNumber('23e4').valueOf(), 230000);

  t.throws(() => new LosslessNumber('123456789012345678901234').valueOf(),
      /Cannot convert to number: number would be truncated/);
  t.throws(() => new LosslessNumber('2.3e+500').valueOf(),
      /Cannot convert to number: number would overflow/);
  t.throws(() => new LosslessNumber('2.3e-500').valueOf(),
      /Cannot convert to number: number would underflow/);
});

test('LosslessNumber - toString', function (t) {
  t.is(new LosslessNumber('23.4').toString(), '23.4');
});
