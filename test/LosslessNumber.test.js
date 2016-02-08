'use strict';

import test from 'ava';
import 'babel-core/register';

import { LosslessNumber } from '../lib/LosslessNumber';

test('LosslessNumber - create from string', function (t) {
  var n = new LosslessNumber('42');
  t.ok(n.isLosslessNumber, 'should be a lossless number');
  t.same(n.value, '42', 'should contain the right value');

});

test('LosslessNumber - throw when creating from invalid string', function (t) {
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

test('LosslessNumber - create from number', function (t) {
  var n = new LosslessNumber(42);
  t.ok(n.isLosslessNumber, 'should be a lossless number');
  t.same(n.value, '42', 'should contain the right value');
});

test('LosslessNumber - throw when creating from invalid number', function (t) {
  t.throws(() => new LosslessNumber(Math.PI), /Invalid number: contains more than 15 digits/);
  t.throws(() => new LosslessNumber(Infinity), /Invalid number: Infinity/);
  t.throws(() => new LosslessNumber(NaN), /Invalid number: NaN/);
});

test('LosslessNumber - valueOf', function (t) {
  t.same(new LosslessNumber('23.4').valueOf(), 23.4);
  t.same(new LosslessNumber('23e4').valueOf(), 230000);

  t.throws(() => new LosslessNumber('123456789012345678901234').valueOf(),
      /Cannot convert to number: value contains more than 15 digits/);
  t.throws(() => new LosslessNumber('2.3e+500').valueOf(),
      /Cannot convert to number: number overflow/);
});

test('LosslessNumber - toString', function (t) {
  t.same(new LosslessNumber('23.4').toString(), '23.4');
});
