'use strict';

import test from 'ava';
import 'babel-core/register';

import { LosslessNumber } from '../lib/LosslessNumber';

test('LosslessNumber - create a lossless number', function (t) {
  var n = new LosslessNumber('42');
  t.ok(n.isLosslessNumber, 'should be a lossless number');
  t.same(n.value, '42', 'should contain the right value');
});

// TODO: test LosslessNumber
