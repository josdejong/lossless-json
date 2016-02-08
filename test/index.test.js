'use strict';

import test from 'ava';
import 'babel-core/register';

import { LosslessNumber } from '../lib/LosslessNumber';
import { parse, stringify, losslessNumber } from '../lib/index';

test('Public API', function (t) {
  t.same(parse('{}'), {}, 'parse json');
  t.same(stringify({}), '{}', 'stringify json');
  t.ok(losslessNumber(2).isLosslessNumber, 'create lossless number');
});
